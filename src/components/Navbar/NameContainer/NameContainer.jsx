import React from 'react';
import PropTypes from 'prop-types';
import AnimatedOverlay from './AnimatedOverlay/AnimatedOverlay';
import styles from './NameContainer.module.css';

const NameContainer = ({ player, time }) => {
    const getPlayerStatus = () => {
        if (player.name === '...') return 'Empty Slot';
        if (!player.ready && !player.started) return 'Not Ready';
        if (player.nowMoving) return 'Playing Now';
        if (player.ready) return 'Ready';
        return 'Waiting';
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
            <p style={{ fontWeight: player.nowMoving ? 'bold' : 'normal' }}>
                {player.name}
                {player.nowMoving && ' 🎲'}
            </p>
            <span className={styles.status}>{getPlayerStatus()}</span>
            {player.nowMoving ? <AnimatedOverlay time={time} /> : null}
        </div>
    );
};

NameContainer.propTypes = {
    player: PropTypes.object,
    time: PropTypes.number,
    testId: PropTypes.string,
};

export default NameContainer;
