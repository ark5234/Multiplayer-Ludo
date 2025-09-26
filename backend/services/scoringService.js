/**
 * Scoring Service for Multiplayer Ludo Game
 * Handles all scoring logic independently from core game mechanics
 */

/**
 * Calculate player's total score from all their pawns
 * @param {Array} pawns - Array of all pawns in the room
 * @param {String} playerColor - Player's color
 * @returns {Number} Total score for the player
 */
const calculatePlayerScore = (pawns, playerColor) => {
    const playerPawns = pawns.filter(pawn => pawn.color === playerColor);
    return playerPawns.reduce((total, pawn) => total + pawn.score, 0);
};

/**
 * Get scores for all players in the room
 * @param {Object} room - Room object containing players and pawns
 * @returns {Object} Object with player colors as keys and scores as values
 */
const getAllPlayerScores = (room) => {
    const scores = {};
    room.players.forEach(player => {
        scores[player.color] = calculatePlayerScore(room.pawns, player.color);
    });
    return scores;
};

/**
 * Update pawn score after movement
 * @param {Object} pawn - Pawn object to update
 * @param {Number} stepsMoved - Number of steps moved (dice value)
 */
const updatePawnScoreAfterMove = (pawn, stepsMoved) => {
    pawn.updateScore(stepsMoved);
};

/**
 * Handle capture logic for scoring
 * @param {Object} strikerPawn - Attacking pawn
 * @param {Object} victimPawn - Captured pawn
 */
const handleCaptureScoring = (strikerPawn, victimPawn) => {
    // Striker gains victim's score
    strikerPawn.score += victimPawn.score;
    
    // Victim loses all points and returns to base
    victimPawn.resetScore();
};

/**
 * Get player capture count (for tie-breaking)
 * @param {Array} pawns - Array of all pawns in the room
 * @param {String} playerColor - Player's color
 * @returns {Number} Number of captures made by this player
 */
const getPlayerCaptureCount = (pawns, playerColor) => {
    // This would need to be tracked separately in a real implementation
    // For now, we'll calculate based on score distribution
    const playerPawns = pawns.filter(pawn => pawn.color === playerColor);
    const totalScore = playerPawns.reduce((total, pawn) => total + pawn.score, 0);
    
    // Estimate captures based on score patterns
    // This is a simplified approach - in a real game you'd track captures directly
    return Math.floor(totalScore / 10); // Rough estimate
};

/**
 * Determine winner based on scores and captures
 * @param {Object} room - Room object
 * @returns {String} Winner's color or null if no clear winner
 */
const determineWinner = (room) => {
    const scores = getAllPlayerScores(room);
    const maxScore = Math.max(...Object.values(scores));
    
    // Get all players with max score
    const topPlayers = Object.keys(scores).filter(color => scores[color] === maxScore);
    
    if (topPlayers.length === 1) {
        return topPlayers[0];
    }
    
    // Tie-breaker: most captures
    let winner = topPlayers[0];
    let maxCaptures = getPlayerCaptureCount(room.pawns, winner);
    
    for (let i = 1; i < topPlayers.length; i++) {
        const captures = getPlayerCaptureCount(room.pawns, topPlayers[i]);
        if (captures > maxCaptures) {
            winner = topPlayers[i];
            maxCaptures = captures;
        }
    }
    
    return winner;
};

/**
 * Format scores for client display
 * @param {Object} room - Room object
 * @returns {Object} Formatted scores with player names and colors
 */
const formatScoresForClient = (room) => {
    const scores = {};
    room.players.forEach(player => {
        scores[player.color] = {
            playerName: player.name,
            color: player.color,
            score: calculatePlayerScore(room.pawns, player.color),
            captures: getPlayerCaptureCount(room.pawns, player.color)
        };
    });
    return scores;
};

module.exports = {
    calculatePlayerScore,
    getAllPlayerScores,
    updatePawnScoreAfterMove,
    handleCaptureScoring,
    getPlayerCaptureCount,
    determineWinner,
    formatScoresForClient
};