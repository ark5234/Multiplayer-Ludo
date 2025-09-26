import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../App';
import './WinnerOverlay.css';

const WinnerOverlay = ({ winner, onPlayAgain }) => {
    const [finalScores, setFinalScores] = useState({});
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            // Get the final scores when winner is announced
            socket.on('game:scores', (scoresData) => {
                setFinalScores(scoresData);
            });

            return () => {
                socket.off('game:scores');
            };
        }
    }, [socket]);

    const getSortedPlayers = () => {
        if (!finalScores || Object.keys(finalScores).length === 0) return [];
        
        return Object.values(finalScores).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.captures - a.captures;
        });
    };

    const sortedPlayers = getSortedPlayers();
    const winnerData = sortedPlayers.find(player => player.color === winner) || 
                      { color: winner, score: 0, captures: 0 };

    return (
        <div className="winner-overlay">
            <div className="winner-container">
                <div className="trophy-section">
                    <div className="trophy">🏆</div>
                    <h1 className="winner-title">Game Over!</h1>
                    <h2 className="winner-name">
                        Winner: <span style={{ color: winner }}>{winner.toUpperCase()}</span>
                    </h2>
                    <div className="winner-stats">
                        <div className="stat">
                            <span className="stat-value">{winnerData.score}</span>
                            <span className="stat-label">Points</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{winnerData.captures}</span>
                            <span className="stat-label">Captures</span>
                        </div>
                    </div>
                </div>

                {sortedPlayers.length > 0 && (
                    <div className="final-scoreboard">
                        <h3>Final Standings</h3>
                        <div className="final-scores">
                            {sortedPlayers.map((player, index) => (
                                <div 
                                    key={player.color} 
                                    className={`final-score-row ${player.color === winner ? 'winner-row' : ''}`}
                                >
                                    <div className="ranking">#{index + 1}</div>
                                    <div className="player-info">
                                        <div className={`color-dot ${player.color}`}></div>
                                        <span className="color-name">{player.color.toUpperCase()}</span>
                                        {index === 0 && <span className="crown">👑</span>}
                                    </div>
                                    <div className="final-score-info">
                                        <span className="points">{player.score} pts</span>
                                        <span className="captures-count">({player.captures} captures)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="winner-actions">
                    <button className="play-again-btn" onClick={onPlayAgain}>
                        Play Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WinnerOverlay;