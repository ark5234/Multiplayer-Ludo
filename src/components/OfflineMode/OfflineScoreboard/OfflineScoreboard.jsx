import React from 'react';
import styles from './OfflineScoreboard.module.css';

const OfflineScoreboard = ({ players, currentPlayer }) => {
    return (
        <div className={styles.scoreboardContainer}>
            <h3 className={styles.title}>📊 Scoreboard</h3>
            
            <div className={styles.playersList}>
                {players.map((player, index) => (
                    <div 
                        key={player.id}
                        className={`${styles.playerScore} ${
                            index === currentPlayer ? styles.active : ''
                        }`}
                    >
                        <div className={styles.playerInfo}>
                            <span className={`${styles.colorDot} ${styles[player.color]}`}></span>
                            <span className={styles.playerName}>{player.name}</span>
                            {index === currentPlayer && (
                                <span className={styles.currentIndicator}>👆</span>
                            )}
                        </div>
                        
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Points:</span>
                                <span className={styles.statValue}>{player.points || 0}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Pawns Home:</span>
                                <span className={styles.statValue}>{player.pawnsHome || 4}</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Finished:</span>
                                <span className={styles.statValue}>{player.pawnsFinished || 0}</span>
                            </div>
                        </div>
                        
                        <div className={styles.progress}>
                            <div className={styles.progressBar}>
                                <div 
                                    className={`${styles.progressFill} ${styles[player.color + 'Fill']}`}
                                    style={{ width: `${((player.pawnsFinished || 0) / 4) * 100}%` }}
                                ></div>
                            </div>
                            <span className={styles.progressText}>
                                {player.pawnsFinished || 0}/4
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OfflineScoreboard;