const { sendToPlayersRolledNumber, sendWinner, sendScoreUpdate } = require('../socket/emits');

const rollDice = () => {
    const rolledNumber = Math.ceil(Math.random() * 6);
    return rolledNumber;
};

const makeRandomMove = async roomId => {
    const { updateRoom, getRoom } = require('../services/roomService');
    const room = await getRoom(roomId);
    if (room.winner) return;
    
    // Check if game time has ended (implement timer logic here if needed)
    // For now, using the existing move timeout logic
    
    if (room.rolledNumber === null) {
        room.rolledNumber = rollDice();
        sendToPlayersRolledNumber(room._id.toString(), room.rolledNumber);
    }

    const pawnsThatCanMove = room.getPawnsThatCanMove();
    if (pawnsThatCanMove.length > 0) {
        const randomPawn = pawnsThatCanMove[Math.floor(Math.random() * pawnsThatCanMove.length)];
        room.movePawn(randomPawn);
    }
    room.changeMovingPlayer();
    
    // Send real-time score update after random move
    const formattedScores = room.getFormattedScores();
    sendScoreUpdate(room._id.toString(), formattedScores);
    
    // Check for traditional winner (all pawns home)
    let winner = room.getWinner();
    
    // If no traditional winner and we need to check for score-based winner
    // (this could be triggered by a separate game timer mechanism)
    if (!winner) {
        // In a full implementation, you'd check if game time has expired here
        // For now, the traditional win condition takes precedence
    }
    
    if (winner) {
        room.endGame(winner);
        sendWinner(room._id.toString(), winner);
    }
    await updateRoom(room);
};

// Function to end game based on timer expiry and determine winner by score
const endGameByTimer = async roomId => {
    const { updateRoom, getRoom } = require('../services/roomService');
    const room = await getRoom(roomId);
    if (room.winner) return;
    
    // Determine winner by score when timer ends
    const winner = room.getWinnerByScore();
    if (winner) {
        room.endGame(winner);
        sendWinner(room._id.toString(), winner);
        await updateRoom(room);
    }
};

const isMoveValid = (session, pawn, room) => {
    if (session.color !== pawn.color) {
        return false;
    }
    if (session.playerId !== room.getCurrentlyMovingPlayer()._id.toString()) {
        return false;
    }
    return true;
};

module.exports = { rollDice, makeRandomMove, endGameByTimer, isMoveValid };
