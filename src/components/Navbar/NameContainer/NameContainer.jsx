import React from 'react';
import PropTypes from 'prop-types';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';
import styles from './NameContainer.module.css';

const NameContainer = ({ player, time, playerIndex }) => {
    const getPlayerStatus = () => {
        if (player.name === '...') return 'Empty Slot';
        if (!player.ready && !player.started) return 'Not Ready';
        if (player.nowMoving) return '🎲 Your Turn';
        if (player.ready) return 'Ready';
        return 'Waiting';
    };

    const getPlayerPosition = () => {
        const positions = ['P1', 'P2', 'P3', 'P4'];
        return positions[playerIndex] || `P${playerIndex + 1}`;
    };

    const getBackgroundColor = () => {
        if (player.name === '...') return '#333';
        if (player.nowMoving) return player.color;
        if (player.ready) return player.color;
        return 'lightgrey';
    };

    const getBorderStyle = () => {
        if (player.nowMoving) {
            return {
                border: `3px solid #ffff00`,
                boxShadow: `0 0 10px ${player.color}`,
                animation: 'pulse 1s infinite'
            };
        }
        return {};
    };

    return (
        <div 
            className={styles.container} 
            style={{ 
                backgroundColor: getBackgroundColor(),
                ...getBorderStyle()
            }}
        >
            <div className={styles.playerInfo}>
                <span className={styles.position}>{getPlayerPosition()}</span>
                <p style={{ fontWeight: player.nowMoving ? 'bold' : 'normal' }}>
                    {player.name}
                    {player.nowMoving && ' 🎲'}
                </p>
            </div>
            <span className={styles.status}>{getPlayerStatus()}</span>
            {player.nowMoving ? <AnimatedOverlay time={time} /> : null}
        </div>
    );
};

NameContainer.propTypes = {
    player: PropTypes.object,
    time: PropTypes.number,
    testId: PropTypes.string,
    playerIndex: PropTypes.number
};

export default NameContainer;
