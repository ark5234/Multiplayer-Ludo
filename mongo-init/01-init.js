// MongoDB initialization script for Docker container
// This file runs in MongoDB's JavaScript shell environment during container startup
// The 'db' and 'print' are MongoDB shell built-in objects

// Switch to the multiplayer-ludo database
// eslint-disable-next-line no-global-assign
db = db.getSiblingDB('multiplayer-ludo');

// Create a dedicated user for the application
db.createUser({
  user: 'ludouser',
  pwd: 'ludopass123',
  roles: [
    {
      role: 'readWrite',
      db: 'multiplayer-ludo'
    }
  ]
});

// Create indexes for better query performance
db.rooms.createIndex({ "name": 1 });
db.rooms.createIndex({ "createDate": 1 });
db.rooms.createIndex({ "started": 1 });

// Log completion (MongoDB shell function)
print('MongoDB initialization complete for Multiplayer Ludo');