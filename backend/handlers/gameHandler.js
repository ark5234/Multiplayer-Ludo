const { getRoom, updateRoom } = require('../services/roomService');
const { sendToPlayersRolledNumber, sendWinner, sendScoreUpdate, sendToPlayersData } = require('../socket/emits');
const { rollDice, isMoveValid } = require('./handlersFunctions');

module.exports = socket => {
    const req = socket.request;

    const handleMovePawn = async pawnId => {
        const room = await getRoom(req.session.roomId);
        if (!room) return;
        if (room.winner) return;
        const pawn = room.getPawn(pawnId);
        const player = room.getPlayer(req.session.playerId);
        
        if (isMoveValid(req.session, pawn, room)) {
            const oldPosition = pawn.position;
            
            // Use the updated movePawn method which handles scoring
            room.movePawn(pawn);
            
            // Emit move event for activity feed
            const io = require('../socket/socketManager').getIO();
            io.to(room._id.toString()).emit('game:move', {
                playerColor: player.color,
                pawnId: pawn._id,
                fromPosition: oldPosition,
                toPosition: pawn.position
            });
            
            room.changeMovingPlayer();
            
            // Send real-time score update
            const formattedScores = room.getFormattedScores();
            sendScoreUpdate(room._id.toString(), formattedScores);
            
            const winner = room.getWinner();
            if (winner) {
                room.endGame(winner);
                sendWinner(room._id.toString(), winner);
            }
            
            // Update and manually send room data since change streams might not be available
            const updatedRoom = await updateRoom(room);
            sendToPlayersData(updatedRoom);
        }
    };

    const handleRollDice = async () => {
        const rolledNumber = rollDice();
        const room = await getRoom(req.session.roomId);
        if (!room) return;
        
        const player = room.getPlayer(req.session.playerId);
        
        // Emit roll event for activity feed
        const io = require('../socket/socketManager').getIO();
        io.to(room._id.toString()).emit('game:roll', {
            playerColor: player.color,
            rolledNumber: rolledNumber
        });
        
        sendToPlayersRolledNumber(req.session.roomId, rolledNumber);
        const updatedRoom = await updateRoom({ _id: req.session.roomId, rolledNumber: rolledNumber });
        
        // Manually send room data update
        sendToPlayersData(updatedRoom);
        
        if (player && !player.canMove(updatedRoom, rolledNumber)) {
            updatedRoom.changeMovingPlayer();
            const finalRoom = await updateRoom(updatedRoom);
            sendToPlayersData(finalRoom);
        }
    };

    socket.on('game:roll', handleRollDice);
    socket.on('game:move', handleMovePawn);
};
