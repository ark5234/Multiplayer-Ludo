import React, { useState, useEffect, useContext } from 'react';
import ReactLoading from 'react-loading';
import { PlayerDataContext, SocketContext } from '../../App';
import useSocketData from '../../hooks/useSocketData';
import Map from './Map/Map';
import Navbar from '../Navbar/Navbar';
import Scoreboard from '../Scoreboard/Scoreboard';
import WinnerOverlay from '../WinnerOverlay/WinnerOverlay';
import GameActivity from '../GameActivity/GameActivity';
import RoomManagement from '../RoomManagement/RoomManagement';
import styles from './Gameboard.module.css';

const Gameboard = () => {
    const socket = useContext(SocketContext);
    const context = useContext(PlayerDataContext);
    const [pawns, setPawns] = useState([]);
    const [players, setPlayers] = useState([]);

    const [rolledNumber, setRolledNumber] = useSocketData('game:roll');
    const [time, setTime] = useState();
    const [isReady, setIsReady] = useState();
    const [nowMoving, setNowMoving] = useState(false);
    const [started, setStarted] = useState(false);

    const [movingPlayer, setMovingPlayer] = useState('red');

    const [winner, setWinner] = useState(null);

    useEffect(() => {
        socket.emit('room:data', context.roomId);
        socket.on('room:data', data => {
            data = JSON.parse(data);
            if (data.players == null) return;
            // Filling navbar with empty player nick container
            while (data.players.length !== 4) {
                data.players.push({ name: '...' });
            }
            // Checks if client is currently moving player by session ID
            const nowMovingPlayer = data.players.find(player => player.nowMoving === true);
            if (nowMovingPlayer) {
                if (nowMovingPlayer._id === context.playerId) {
                    setNowMoving(true);
                } else {
                    setNowMoving(false);
                }
                setMovingPlayer(nowMovingPlayer.color);
            }
            const currentPlayer = data.players.find(player => player._id === context.playerId);
            setIsReady(currentPlayer.ready);
            setRolledNumber(data.rolledNumber);
            setPlayers(data.players);
            setPawns(data.pawns);
            setStarted(data.started);
            setTime(data.nextMoveTime);
            setWinner(data.winner);
        });

        socket.on('player:timeout', () => {
            setNowMoving(false);
        });

        return () => {
            socket.off('room:data');
            socket.off('player:timeout');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, context.roomId, context.playerId]);

    if (!socket) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ReactLoading type="spinningBubbles" color="white" height={200} width={200} />
            </div>
        );
    }

    return (
        <>
            {players.length > 0 ? (
                <div className={styles.gameContainer}>
                    {/* Game Board Section */}
                    <div className={styles.gameBoard}>
                        <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />
                        <div className={styles.navbarContainer}>
                            <Navbar
                                players={players}
                                started={started}
                                time={time}
                                isReady={isReady}
                                rolledNumber={rolledNumber}
                                nowMoving={nowMoving}
                                movingPlayer={movingPlayer}
                                ended={!!winner}
                            />
                        </div>
                    </div>
                    
                    {/* Side Panel */}
                    <div className={styles.sidePanel}>
                        {/* Room Information Panel */}
                        <div className={styles.roomInfoPanel}>
                            <RoomManagement 
                                roomData={{ 
                                    players, 
                                    name: 'Game Room',
                                    _id: context.roomId
                                }} 
                                players={players} 
                            />
                        </div>
                        
                        {/* Scoreboard Panel */}
                        {started && (
                            <div className={styles.scoreboardPanel}>
                                <Scoreboard />
                            </div>
                        )}
                        
                        {/* Game Activity Panel */}
                        {started && (
                            <div className={styles.gameActivityPanel}>
                                <GameActivity />
                            </div>
                        )}
                    </div>
                    
                    {/* Waiting Overlay */}
                    {!started && (
                        <div className={styles.waitingOverlay}>
                            <h3>Waiting for Game to Start</h3>
                            <p>Players in room: {players.filter(p => p.name !== '...').length}/4</p>
                            <p>Ready players: {players.filter(p => p.ready).length}</p>
                            <p className={styles.readyMessage}>
                                {!isReady ? 'Click the "Ready" switch below to join the game!' : 'Waiting for other players to get ready...'}
                            </p>
                            <p className={styles.startHint}>
                                Need at least 2 ready players to start
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <ReactLoading type="spinningBubbles" color="white" height={200} width={200} />
                </div>
            )}
            {winner && (
                <WinnerOverlay 
                    winner={winner}
                    onPlayAgain={() => socket.emit('player:exit')}
                />
            )}
        </>
    );
};

export default Gameboard;