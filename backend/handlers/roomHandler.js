const { getRooms, getRoom, updateRoom, createNewRoom } = require('../services/roomService');
const { sendToOnePlayerRooms, sendToOnePlayerData, sendWinner, sendScoreUpdate } = require('../socket/emits');
const Room = require('../models/room');

module.exports = socket => {
    const req = socket.request;

    const handleGetData = async () => {
        console.log(`🏠 Getting room data for session roomId: ${req.session.roomId}`);
        
        if (!req.session.roomId) {
            console.log(`❌ No roomId in session for socket: ${socket.id}`);
            socket.emit('error:noRoom', { message: 'No room associated with session' });
            return;
        }
        
        const room = await getRoom(req.session.roomId);
        
        // Check if room exists
        if (!room) {
            console.log(`❌ Room not found: ${req.session.roomId}`);
            socket.emit('error:roomNotFound', { 
                message: 'Room not found or has expired',
                roomId: req.session.roomId 
            });
            return;
        }
        
        console.log(`✅ Found room: ${room._id}, players: ${room.players.length}`);
        
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

    const handleDeleteRoom = async (roomId) => {
        try {
            const room = await getRoom(roomId);
            if (room) {
                // Notify all players in the room
                socket.to(roomId).emit('room:deleted', { message: 'Room has been deleted' });
                // Remove the room
                await Room.findByIdAndDelete(roomId);
                // Update room list for all clients
                sendToOnePlayerRooms(socket.id, await getRooms());
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const handleKickPlayer = async ({ roomId, playerId }) => {
        try {
            const room = await getRoom(roomId);
            if (room) {
                // Remove player from room
                room.players = room.players.filter(p => p._id.toString() !== playerId);
                await updateRoom(room);
                // Notify the kicked player
                socket.to(roomId).emit('player:kicked', { playerId });
            }
        } catch (error) {
            console.error('Error kicking player:', error);
        }
    };

    socket.on('room:data', handleGetData);
    socket.on('room:rooms', handleGetAllRooms);
    socket.on('room:create', handleCreateRoom);
    socket.on('room:delete', handleDeleteRoom);
    socket.on('room:kick', handleKickPlayer);
};
