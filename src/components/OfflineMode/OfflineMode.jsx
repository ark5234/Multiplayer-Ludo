import React, { useState } from 'react';
import styles from './OfflineMode.module.css';
import Map from '../Gameboard/Map/Map';
import OfflineDiceRoller from './OfflineDiceRoller/OfflineDiceRoller';
import OfflineScoreboard from './OfflineScoreboard/OfflineScoreboard';
import OfflineGameActivity from './OfflineGameActivity/OfflineGameActivity';
import WinnerOverlay from '../WinnerOverlay/WinnerOverlay';

const OfflineMode = () => {
    // Game setup state
    const [gameSetup, setGameSetup] = useState(true);
    const [numPlayers, setNumPlayers] = useState(2);
    const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2', '', '']);
    
    // Game state
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [players, setPlayers] = useState([]);
    const [pawns, setPawns] = useState([]);
    const [rolledNumber, setRolledNumber] = useState(null);
    const [canMove, setCanMove] = useState(false);
    const [winner, setWinner] = useState(null);
    const [gameActivity, setGameActivity] = useState([]);
    const [scores, setScores] = useState([]);

    // Initialize game when setup is complete
    const startOfflineGame = () => {
        if (playerNames.slice(0, numPlayers).some(name => !name.trim())) {
            alert('Please enter names for all players!');
            return;
        }

        const colors = ['red', 'blue', 'green', 'yellow'];
        const initialPlayers = [];
        const initialPawns = [];
        const initialScores = [];

        // Create players and pawns
        for (let i = 0; i < numPlayers; i++) {
            const player = {
                id: i,
                name: playerNames[i],
                color: colors[i],
                pawnsHome: 4,
                pawnsFinished: 0,
                active: i === 0
            };
            initialPlayers.push(player);
            initialScores.push({ ...player, points: 0, captures: 0 });

            // Initialize pawns for each player
            for (let j = 0; j < 4; j++) {
                initialPawns.push({
                    id: `${colors[i]}_${j}`,
                    color: colors[i],
                    position: -1, // -1 means in home
                    playerId: i
                });
            }
        }

        setPlayers(initialPlayers);
        setPawns(initialPawns);
        setScores(initialScores);
        setGameSetup(false);
        
        addGameActivity(`${playerNames[0]}'s turn - Roll the dice!`);
    };

    const addGameActivity = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setGameActivity(prev => [{
            id: Date.now(),
            timestamp,
            message
        }, ...prev]);
    };

    const handleDiceRoll = (number) => {
        setRolledNumber(number);
        const currentPlayerData = players[currentPlayer];
        addGameActivity(`${currentPlayerData.name} rolled ${number}`);
        
        // Check if player can move any pawn
        const playerPawns = pawns.filter(pawn => pawn.playerId === currentPlayer);
        const canMoveAny = playerPawns.some(pawn => {
            if (pawn.position === -1) {
                return number === 6; // Can only exit home with 6
            }
            return pawn.position < 56; // Can move if not at finish
        });

        if (canMoveAny) {
            setCanMove(true);
        } else {
            addGameActivity(`${currentPlayerData.name} cannot move any pawn`);
            setTimeout(() => {
                nextPlayer();
            }, 2000);
        }
    };

    const handlePawnClick = (pawnId) => {
        if (!canMove) return;

        const pawn = pawns.find(p => p.id === pawnId);
        if (pawn.playerId !== currentPlayer) return;

        let newPosition = pawn.position;
        const currentPlayerData = players[currentPlayer];

        // Move pawn logic
        if (pawn.position === -1 && rolledNumber === 6) {
            // Exit from home
            newPosition = 0;
            addGameActivity(`${currentPlayerData.name} brought a pawn out of home`);
        } else if (pawn.position >= 0 && pawn.position < 56) {
            // Normal move
            newPosition = Math.min(pawn.position + rolledNumber, 56);
            if (newPosition === 56) {
                addGameActivity(`${currentPlayerData.name} finished a pawn!`);
                updatePlayerStats(currentPlayer, 'finish');
            } else {
                addGameActivity(`${currentPlayerData.name} moved pawn ${rolledNumber} spaces`);
            }
        } else {
            return; // Cannot move
        }

        // Update pawns
        setPawns(prev => prev.map(p => 
            p.id === pawnId ? { ...p, position: newPosition } : p
        ));

        // Update scores
        setScores(prev => prev.map(score => 
            score.id === currentPlayer 
                ? { ...score, points: score.points + (newPosition === 56 ? 10 : 1) }
                : score
        ));

        setCanMove(false);
        
        // Check for winner
        const finishedPawns = pawns.filter(p => 
            p.playerId === currentPlayer && (p.position === 56 || newPosition === 56)
        ).length + (newPosition === 56 ? 1 : 0);
        
        if (finishedPawns >= 4) {
            setWinner(currentPlayerData);
            addGameActivity(`🎉 ${currentPlayerData.name} wins the game!`);
            return;
        }

        // Next turn (unless rolled 6)
        if (rolledNumber !== 6) {
            setTimeout(() => {
                nextPlayer();
            }, 1500);
        } else {
            addGameActivity(`${currentPlayerData.name} gets another turn for rolling 6!`);
            setRolledNumber(null);
        }
    };

    const updatePlayerStats = (playerId, action) => {
        setPlayers(prev => prev.map(p => {
            if (p.id === playerId) {
                switch (action) {
                    case 'finish':
                        return { ...p, pawnsFinished: p.pawnsFinished + 1, pawnsHome: p.pawnsHome - 1 };
                    default:
                        return p;
                }
            }
            return p;
        }));
    };

    const nextPlayer = () => {
        const nextPlayerIndex = (currentPlayer + 1) % numPlayers;
        setCurrentPlayer(nextPlayerIndex);
        setRolledNumber(null);
        setCanMove(false);
        
        // Update active player
        setPlayers(prev => prev.map((p, index) => ({
            ...p,
            active: index === nextPlayerIndex
        })));
        
        addGameActivity(`${playerNames[nextPlayerIndex]}'s turn - Roll the dice!`);
    };

    const resetGame = () => {
        setGameSetup(true);
        setCurrentPlayer(0);
        setPlayers([]);
        setPawns([]);
        setRolledNumber(null);
        setCanMove(false);
        setWinner(null);
        setGameActivity([]);
        setScores([]);
    };

    const handlePlayerNameChange = (index, name) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    if (gameSetup) {
        return (
            <div className={styles.setupContainer}>
                <div className={styles.setupPanel}>
                    <h1 className={styles.title}>🎲 Offline Ludo</h1>
                    <p className={styles.subtitle}>Play with friends in person!</p>
                    
                    <div className={styles.setupSection}>
                        <label className={styles.label}>
                            Number of Players:
                            <select 
                                value={numPlayers} 
                                onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                                className={styles.select}
                            >
                                <option value={2}>2 Players</option>
                                <option value={3}>3 Players</option>
                                <option value={4}>4 Players</option>
                            </select>
                        </label>
                    </div>

                    <div className={styles.playersSetup}>
                        <h3>Player Names:</h3>
                        {Array.from({ length: numPlayers }, (_, i) => {
                            const colors = ['Red', 'Blue', 'Green', 'Yellow'];
                            return (
                                <div key={i} className={styles.playerInput}>
                                    <span className={`${styles.colorDot} ${styles[colors[i].toLowerCase()]}`}></span>
                                    <input
                                        type="text"
                                        value={playerNames[i]}
                                        onChange={(e) => handlePlayerNameChange(i, e.target.value)}
                                        placeholder={`${colors[i]} Player`}
                                        className={styles.nameInput}
                                        maxLength={15}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={startOfflineGame} className={styles.startButton}>
                        🚀 Start Game
                    </button>

                    <div className={styles.instructions}>
                        <h4>📋 How to Play:</h4>
                        <ul>
                            <li>Pass the device to the current player</li>
                            <li>Tap "Roll Dice" when it's your turn</li>
                            <li>Click on your pawn to move it</li>
                            <li>Roll 6 to bring pawns out of home</li>
                            <li>Get all 4 pawns to the center to win!</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gameContainer}>
            {/* Game Board */}
            <div className={styles.gameBoard}>
                <Map 
                    pawns={pawns} 
                    nowMoving={canMove} 
                    rolledNumber={rolledNumber}
                    onPawnClick={handlePawnClick}
                    offlineMode={true}
                />
                
                <div className={styles.gameControls}>
                    <OfflineDiceRoller
                        currentPlayer={players[currentPlayer]}
                        onRoll={handleDiceRoll}
                        rolledNumber={rolledNumber}
                        canRoll={!canMove && rolledNumber === null}
                    />
                </div>
            </div>

            {/* Side Panel */}
            <div className={styles.sidePanel}>
                <div className={styles.currentPlayerPanel}>
                    <h3>Current Turn</h3>
                    {players[currentPlayer] && (
                        <div className={styles.currentPlayerInfo}>
                            <span className={`${styles.playerDot} ${styles[players[currentPlayer].color]}`}></span>
                            <span className={styles.playerName}>{players[currentPlayer].name}</span>
                        </div>
                    )}
                </div>

                <div className={styles.scoreboardPanel}>
                    <OfflineScoreboard players={scores} currentPlayer={currentPlayer} />
                </div>

                <div className={styles.activityPanel}>
                    <OfflineGameActivity activities={gameActivity} />
                </div>

                <button onClick={resetGame} className={styles.resetButton}>
                    🔄 New Game
                </button>
            </div>

            {winner && (
                <WinnerOverlay 
                    winner={winner}
                    onPlayAgain={resetGame}
                />
            )}
        </div>
    );
};

export default OfflineMode;