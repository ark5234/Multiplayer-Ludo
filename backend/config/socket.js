const socketManager = require('../socket/socketManager');
const registerPlayerHandlers = require('../handlers/playerHandler');
const registerRoomHandlers = require('../handlers/roomHandler');
const registerGameHandlers = require('../handlers/gameHandler');
const { sessionMiddleware, wrap } = require('../config/session');

module.exports = function (server) {
    socketManager.initialize(server);
    socketManager.getIO().engine.on('initial_headers', (headers, req) => {
        if (req.cookieHolder) {
            headers['set-cookie'] = req.cookieHolder;
            delete req.cookieHolder;
        }
    });
    socketManager.getIO().use(wrap(sessionMiddleware));
    socketManager.getIO().on('connection', socket => {
        console.log(`🔌 New Socket.IO connection: ${socket.id}`);
        console.log(`📋 Session data:`, socket.request.session);
        
        registerPlayerHandlers(socket);
        registerRoomHandlers(socket);
        registerGameHandlers(socket);
        
        // Enhanced connection logging
        if (socket.request.session.roomId) {
            const roomId = socket.request.session.roomId.toString();
            console.log(`🏠 Player joining room: ${roomId}`);
            socket.join(roomId);
            socket.emit('player:data', JSON.stringify(socket.request.session));
        } else {
            console.log(`👤 New player connection without room - ready for room selection`);
            // Send empty session to indicate no room yet
            socket.emit('player:data', JSON.stringify(socket.request.session));
        }
        
        // Handle disconnect
        socket.on('disconnect', (reason) => {
            console.log(`🔌 Socket disconnected: ${socket.id}, reason: ${reason}`);
        });
    });
};
