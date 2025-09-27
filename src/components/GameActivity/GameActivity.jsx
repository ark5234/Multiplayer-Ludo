import React, { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../../App';
import styles from './GameActivity.module.css';

const GameActivity = () => {
    const socket = useContext(SocketContext);
    const [activities, setActivities] = useState([]);
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

        // Listen for game events
        socket.on('game:move', (data) => {
            addActivity(`🎯 ${data.playerColor} moved a pawn`);
        });

        socket.on('game:capture', (data) => {
            addActivity(`💥 ${data.attacker} captured ${data.victim}'s pawn!`);
        });

        socket.on('game:roll', (data) => {
            addActivity(`🎲 ${data.playerColor} rolled ${data.rolledNumber}`);
        });

        socket.on('game:winner', (winner) => {
            addActivity(`👑 ${winner} won the game!`);
        });

        socket.on('player:joined', (data) => {
            addActivity(`📥 ${data.playerName} joined the game`);
        });

        socket.on('player:left', (data) => {
            addActivity(`📤 ${data.playerName} left the game`);
        });

        // Initial activity
        addActivity('🎮 Game activity will appear here');

        return () => {
            socket.off('game:move');
            socket.off('game:capture');
            socket.off('game:roll');
            socket.off('game:winner');
            socket.off('player:joined');
            socket.off('player:left');
        };
    }, [socket]);

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