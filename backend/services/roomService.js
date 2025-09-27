const Room = require('../models/room');
const { sendToPlayersData, sendScoreUpdate } = require('../socket/emits');

const getRoom = async roomId => {
    return await Room.findOne({ _id: roomId }).exec();
};

const getRooms = async () => {
    return await Room.find().exec();
};

const updateRoom = async room => {
    return await Room.findOneAndUpdate({ _id: room._id }, room).exec();
};

const getJoinableRoom = async () => {
    return await Room.findOne({ full: false, started: false }).exec();
};

const createNewRoom = async data => {
    const room = new Room(data);
    await room.save();
    return room;
};

// Only set up change streams if MongoDB supports it (replica sets)
// For development with local MongoDB, we'll use manual updates instead
// Uncomment below if you're using MongoDB Atlas or replica sets
/*
try {
    Room.watch().on('change', async data => {
        const room = await getRoom(data.documentKey._id);
        sendToPlayersData(room);
        
        // Send score updates if the game has started
        if (room && room.started) {
            const formattedScores = room.getFormattedScores();
            sendScoreUpdate(room._id.toString(), formattedScores);
        }
    });
} catch (error) {
    console.log('Change streams not supported - using manual updates instead');
    // This is fine for development - we'll trigger updates manually
}
*/

console.log('Room service initialized - using manual updates for room changes');

module.exports = { getRoom, getRooms, updateRoom, getJoinableRoom, createNewRoom };
