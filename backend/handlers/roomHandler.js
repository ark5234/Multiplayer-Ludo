const { getRooms, getRoom, updateRoom, createNewRoom } = require('../services/roomService');
const { sendToOnePlayerRooms, sendToOnePlayerData, sendWinner, sendScoreUpdate } = require('../socket/emits');

module.exports = socket => {
    const req = socket.request;

    const handleGetData = async () => {
        const room = await getRoom(req.session.roomId);
        
        // Check if room exists
        if (!room) {
            socket.emit('error:roomNotFound');
            return;
        }
        
        // Handle the situation when the server crashes and any player reconnects after the time has expired
        // Typically, the responsibility for changing players is managed by gameHandler.js.
        if (room.nextMoveTime <= Date.now()) {
            room.changeMovingPlayer();
            await updateRoom(room);
        }
        sendToOnePlayerData(socket.id, room);
        if (room.winner) sendWinner(socket.id, room.winner);
        
        // Send current scores if game has started
        if (room.started) {
            const formattedScores = room.getFormattedScores();
            socket.emit('game:scores', formattedScores);
        }
    };

    const handleGetAllRooms = async () => {
        const rooms = await getRooms();
        sendToOnePlayerRooms(socket.id, rooms);
    };

    const handleCreateRoom = async data => {
        await createNewRoom(data);
        sendToOnePlayerRooms(socket.id, await getRooms());
    };

    socket.on('room:data', handleGetData);
    socket.on('room:rooms', handleGetAllRooms);
    socket.on('room:create', handleCreateRoom);
};
