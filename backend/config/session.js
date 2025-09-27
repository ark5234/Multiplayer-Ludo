const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
    uri: process.env.CONNECTION_URI,
    collection: 'sessions',
});
const sessionMiddleware = session({
    store: store,
    credentials: true,
    cookie: {
        httpOnly: false,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours instead of 20 seconds
    },
    secret: process.env.SESSION_SECRET || 'ludo-default-secret-change-in-production',
    saveUninitialized: true,
    resave: false, // Don't save session if unmodified
});

const wrap = expressMiddleware => (socket, next) => expressMiddleware(socket.request, {}, next);

module.exports = { sessionMiddleware, wrap };
