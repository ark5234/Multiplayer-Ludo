const { getRoom, updateRoom } = require('../services/roomService');
const { sendToPlayersRolledNumber, sendWinner, sendScoreUpdate, sendToPlayersData } = require('../socket/emits');
const { rollDice, isMoveValid } = require('./handlersFunctions');

module.exports = socket => {
    const req = socket.request;

    const handleMovePawn = async pawnId => {
        const room = await getRoom(req.session.roomId);
        if (room.winner) return;
        const pawn = room.getPawn(pawnId);
        if (isMoveValid(req.session, pawn, room)) {
            // Use the updated movePawn method which handles scoring
            room.movePawn(pawn);
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
        sendToPlayersRolledNumber(req.session.roomId, rolledNumber);
        const room = await updateRoom({ _id: req.session.roomId, rolledNumber: rolledNumber });
        
        // Manually send room data update
        sendToPlayersData(room);
        
        const player = room.getPlayer(req.session.playerId);
        if (!player.canMove(room, rolledNumber)) {
            room.changeMovingPlayer();
            const updatedRoom = await updateRoom(room);
            sendToPlayersData(updatedRoom);
        }
    };

    socket.on('game:roll', handleRollDice);
    socket.on('game:move', handleMovePawn);
};
