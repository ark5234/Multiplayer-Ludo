// Legacy credentials file for tests
// In production, use environment variables via .env files

module.exports = process.env.CONNECTION_URI || 'mongodb://localhost:27017/multiplayer-ludo';