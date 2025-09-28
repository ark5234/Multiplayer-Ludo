import React, { useState } from 'react';
import styles from './OfflineDiceRoller.module.css';

const OfflineDiceRoller = ({ currentPlayer, onRoll, rolledNumber, canRoll }) => {
    const [isRolling, setIsRolling] = useState(false);

    const rollDice = () => {
        if (!canRoll) return;
        
        setIsRolling(true);
        
        // Simulate dice rolling animation
        setTimeout(() => {
            const number = Math.floor(Math.random() * 6) + 1;
            onRoll(number);
            setIsRolling(false);
        }, 800);
    };

    const getDiceDisplay = (number) => {
        const dots = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };
        
        return Array.from({ length: 9 }, (_, i) => (
            <div 
                key={i}
                className={`${styles.dot} ${dots[number]?.includes(i) ? styles.visible : ''}`}
            />
        ));
    };

    return (
        <div className={styles.diceContainer}>
            <div className={styles.playerTurn}>
                {currentPlayer && (
                    <>
                        <span className={`${styles.playerDot} ${styles[currentPlayer.color]}`}></span>
                        <span className={styles.playerName}>{currentPlayer.name}'s Turn</span>
                    </>
                )}
            </div>
            
            <div className={styles.diceSection}>
                <div className={`${styles.dice} ${isRolling ? styles.rolling : ''}`}>
                    {rolledNumber && !isRolling ? 
                        getDiceDisplay(rolledNumber) :
                        getDiceDisplay(6)
                    }
                </div>
                
                <button 
                    onClick={rollDice}
                    disabled={!canRoll || isRolling}
                    className={`${styles.rollButton} ${!canRoll ? styles.disabled : ''}`}
                >
                    {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
                </button>
            </div>

            {rolledNumber && (
                <div className={styles.result}>
                    <span className={styles.resultText}>You rolled: {rolledNumber}</span>
                    {rolledNumber === 6 && <span className={styles.bonus}>🎉 Roll again!</span>}
                </div>
            )}
        </div>
    );
};

export default OfflineDiceRoller;