import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../App';
import './Scoreboard.css';

const Scoreboard = () => {
    const [scores, setScores] = useState({});
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            socket.on('game:scores', (scoresData) => {
                setScores(scoresData);
            });

            return () => {
                socket.off('game:scores');
            };
        }
    }, [socket]);

    const getColorClass = (color) => {
        return `score-${color.toLowerCase()}`;
    };

    const getSortedPlayers = () => {
        return Object.values(scores).sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score; // Sort by score descending
            }
            return b.captures - a.captures; // Tie-breaker by captures
        });
    };

    if (!scores || Object.keys(scores).length === 0) {
        return (
            <div className="scoreboard">
                <h3 className="scoreboard-title">Live Scores</h3>
                <div className="scoreboard-content">
                    <p>Waiting for game to start...</p>
                </div>
            </div>
        );
    }

    const sortedPlayers = getSortedPlayers();

    return (
        <div className="scoreboard">
            <h3 className="scoreboard-title">Live Scores</h3>
            <div className="scoreboard-content">
                {sortedPlayers.map((player, index) => (
                    <div 
                        key={player.color} 
                        className={`score-row ${getColorClass(player.color)} ${index === 0 ? 'leading' : ''}`}
                    >
                        <div className="player-info">
                            <div className={`color-indicator ${player.color.toLowerCase()}`}></div>
                            <span className="player-name">
                                {player.color.charAt(0).toUpperCase() + player.color.slice(1)}
                            </span>
                            {index === 0 && <span className="crown">👑</span>}
                        </div>
                        <div className="score-info">
                            <span className="score">{player.score} pts</span>
                            <span className="captures">({player.captures} captures)</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="scoreboard-footer">
                <small>Updates in real-time • Highest score wins</small>
            </div>
        </div>
    );
};

export default Scoreboard;