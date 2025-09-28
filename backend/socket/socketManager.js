const { sessionMiddleware } = require('../config/session');

const socketManager = {
    io: null,
    initialize(server) {
        // Dynamic CORS configuration for Socket.IO
        const corsOptions = {
            origin: process.env.SOCKET_IO_CORS_ORIGIN 
                ? process.env.SOCKET_IO_CORS_ORIGIN.split(',')
                : ['http://localhost:3000', 'http://localhost:3001'],
            credentials: true,
        };

        this.io = require('socket.io')(server, {
            cors: corsOptions,
            allowRequest: (req, callback) => {
                const fakeRes = {
                    getHeader() {
                        return [];
                    },
                    setHeader(key, values) {
                        req.cookieHolder = values[0];
                    },
                    writeHead() {},
                };
                sessionMiddleware(req, fakeRes, () => {
                    if (req.session) {
                        fakeRes.writeHead();
                        req.session.save();
                    }
                    callback(null, true);
                });
            },
        });
    },
    getIO() {
        if (!this.io) {
            throw new Error('Socket.io not initialized');
        }
        return this.io;
    },
};

module.exports = socketManager;
