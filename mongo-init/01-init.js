// Initialize MongoDB for Ludo game
db = db.getSiblingDB('multiplayer-ludo');

// Create admin user for the database
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

// Create collections with indexes for better performance
db.rooms.createIndex({ "name": 1 });
db.rooms.createIndex({ "createDate": 1 });
db.rooms.createIndex({ "started": 1 });

print('MongoDB initialization complete for Multiplayer Ludo');