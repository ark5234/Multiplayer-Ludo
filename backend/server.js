const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const { sessionMiddleware } = require('./config/session');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.set('trust proxy', 1);

// Dynamic CORS configuration for production and development
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(sessionMiddleware);

// Health check endpoint for Render
app.get('/', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Multiplayer Ludo Backend API', 
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', uptime: process.uptime() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')));
    
    // Serve React app for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

require('./config/database')(mongoose);
require('./config/socket')(server);

module.exports = { server };
