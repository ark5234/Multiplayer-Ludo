import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../App';
import styles from './GameActivity.module.css';

const GameActivity = () => {
    const socket = useContext(SocketContext);
    const [activities, setActivities] = useState([]);
    const [currentPlayerColor, setCurrentPlayerColor] = useState(null);
    const maxActivities = 8;

    useEffect(() => {
        const addActivity = (message) => {
            const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const newActivity = { 
                id: Date.now(), 
                message, 
                timestamp 
            };
            
            setActivities(prev => {
                const updated = [newActivity, ...prev];
                return updated.slice(0, maxActivities);
            });
        };

        // Listen for room data updates to track current player
        const handleRoomData = (roomDataString) => {
            try {
                const roomData = JSON.parse(roomDataString);
                if (roomData && roomData.movingPlayer !== undefined) {
                    const playerColors = ['red', 'blue', 'green', 'yellow'];
                    setCurrentPlayerColor(playerColors[roomData.movingPlayer]);
                }
            } catch (e) {
                console.error('Error parsing room data:', e);
            }
        };

        // Enhanced dice roll tracking
        const handleDiceRoll = (data) => {
            let playerColor = 'Player';
            let rolledNumber = null;

            if (typeof data === 'number') {
                // Original format - just the dice number
                rolledNumber = data;
                playerColor = currentPlayerColor || 'Player';
            } else if (data && typeof data === 'object') {
                // New format with detailed info
                if (data.playerColor && data.rolledNumber) {
                    playerColor = data.playerColor;
                    rolledNumber = data.rolledNumber;
                } else if (data.rolledNumber) {
                    rolledNumber = data.rolledNumber;
                    playerColor = currentPlayerColor || 'Player';
                }
            }

            if (rolledNumber !== null) {
                addActivity(`🎲 ${playerColor} rolled ${rolledNumber}`);
            }
        };

        // Listen for game events
        socket.on('room:data', handleRoomData);
        socket.on('game:roll', handleDiceRoll);

        socket.on('game:move', (data) => {
            if (data && data.playerColor) {
                addActivity(`🎯 ${data.playerColor} moved a pawn`);
            }
        });

        socket.on('game:capture', (data) => {
            if (data && data.attacker && data.victim) {
                addActivity(`💥 ${data.attacker} captured ${data.victim}'s pawn!`);
            }
        });

        socket.on('game:winner', (winner) => {
            if (winner) {
                addActivity(`👑 ${winner} won the game!`);
            }
        });

        socket.on('player:joined', (data) => {
            if (data && data.playerName) {
                addActivity(`📥 ${data.playerName} joined the game`);
            }
        });

        socket.on('player:left', (data) => {
            if (data && data.playerName) {
                addActivity(`📤 ${data.playerName} left the game`);
            }
        });

        // Initial activity
        addActivity('🎮 Game activity will appear here');

        return () => {
            socket.off('room:data', handleRoomData);
            socket.off('game:roll', handleDiceRoll);
            socket.off('game:move');
            socket.off('game:capture');
            socket.off('game:winner');
            socket.off('player:joined');
            socket.off('player:left');
        };
    }, [socket, currentPlayerColor]);

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Game Activity</h4>
            <div className={styles.activityList}>
                {activities.map(activity => (
                    <div key={activity.id} className={styles.activityItem}>
                        <span className={styles.timestamp}>{activity.timestamp}</span>
                        <span className={styles.message}>{activity.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameActivity;