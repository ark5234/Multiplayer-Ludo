import React, { useState, useContext } from 'react';
import { SocketContext } from '../../App';
import styles from './RoomManagement.module.css';

const RoomManagement = ({ roomData, players }) => {
    const socket = useContext(SocketContext);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDeleteRoom = () => {
        socket.emit('room:delete', roomData._id);
        setShowConfirmDelete(false);
    };

    const handleKickPlayer = (playerId) => {
        socket.emit('room:kick', { roomId: roomData._id, playerId });
    };

    const getOnlinePlayersCount = () => {
        return players.filter(p => p.name !== '...' && p.online !== false).length;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Room: {roomData.name}</h3>
                <span className={styles.onlineStatus}>
                    {getOnlinePlayersCount()}/4 players online
                </span>
            </div>
            
            <div className={styles.playersList}>
                {players.map((player, index) => (
                    player.name !== '...' && (
                        <div key={index} className={styles.playerItem}>
                            <span className={`${styles.playerName} ${player.online === false ? styles.offline : ''}`}>
                                {player.online === false ? '⚫' : '🟢'} {player.name}
                            </span>
                            <button 
                                className={styles.kickButton}
                                onClick={() => handleKickPlayer(player._id)}
                                title={`Kick ${player.name}`}
                            >
                                ❌
                            </button>
                        </div>
                    )
                ))}
            </div>

            <div className={styles.actions}>
                <button 
                    className={styles.deleteButton}
                    onClick={() => setShowConfirmDelete(true)}
                >
                    🗑️ Delete Room
                </button>
            </div>

            {showConfirmDelete && (
                <div className={styles.confirmOverlay}>
                    <div className={styles.confirmDialog}>
                        <h4>Delete Room?</h4>
                        <p>This will permanently delete the room and kick all players.</p>
                        <div className={styles.confirmButtons}>
                            <button 
                                className={styles.confirmDelete}
                                onClick={handleDeleteRoom}
                            >
                                Yes, Delete
                            </button>
                            <button 
                                className={styles.cancelDelete}
                                onClick={() => setShowConfirmDelete(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomManagement;