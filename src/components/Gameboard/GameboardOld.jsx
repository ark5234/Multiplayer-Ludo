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
            setTime(data.nextMoveTime);
            setStarted(data.started);
        });

        socket.on('game:winner', winner => {
            setWinner(winner);
        });
        socket.on('redirect', () => {
            window.location.reload();
        });

    }, [socket, context.playerId, context.roomId, setRolledNumber]);

    return (
        <>
            {pawns.length === 16 ? (
                <div className='container'>
                    <Navbar
                        players={players}
                        started={started}
                        time={time}
                        isReady={isReady}
                        movingPlayer={movingPlayer}
                        rolledNumber={rolledNumber}
                        nowMoving={nowMoving}
                        ended={winner !== null}
                    />
                    <Map pawns={pawns} nowMoving={nowMoving} rolledNumber={rolledNumber} />
                    {started && <Scoreboard />}
                    {started && <GameActivity />}
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
                <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />
            )}
            {winner ? (
                <WinnerOverlay 
                    winner={winner}
                    onPlayAgain={() => socket.emit('player:exit')}
                />
            ) : null}
        </>
    );
};

export default Gameboard;
