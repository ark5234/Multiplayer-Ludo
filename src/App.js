import React, { useEffect, useState, createContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Gameboard from './components/Gameboard/Gameboard';
import LoginPage from './components/LoginPage/LoginPage';

export const PlayerDataContext = createContext();
export const SocketContext = createContext();

function App() {
    const [playerData, setPlayerData] = useState();
    const [playerSocket, setPlayerSocket] = useState();
    const [redirect, setRedirect] = useState();
    const [connectionError, setConnectionError] = useState(false);
    
    useEffect(() => {
        console.log('Initializing Socket.IO connection...');
        const socket = io(`http://${window.location.hostname}:8080`, { 
            withCredentials: true,
            timeout: 10000,
            transports: ['websocket', 'polling']
        });
        
        // Set connection timeout
        const connectionTimeout = setTimeout(() => {
            if (!socket.connected) {
                console.error('Socket connection timeout');
                setConnectionError(true);
            }
        }, 10000);
        
        socket.on('connect', () => {
            console.log('Socket.IO connected successfully');
            console.log('Socket ID:', socket.id);
            clearTimeout(connectionTimeout);
            setConnectionError(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error);
            setConnectionError(true);
            clearTimeout(connectionTimeout);
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket.IO disconnected:', reason);
        });

        // Debug: Log all socket events
        socket.onAny((eventName, ...args) => {
            console.log(`Socket event received: ${eventName}`, args);
        });

        // Enhanced error handling
        socket.on('error:roomNotFound', (data) => {
            console.error('Room not found error:', data);
            alert('Room not found or has expired. Please create or join a new room.');
            // Optionally redirect to home page
            window.location.href = '/';
        });

        socket.on('error:noRoom', (data) => {
            console.warn('No room in session:', data);
            // This is normal for new users - they need to create or join a room
        });

        socket.on('error:changeRoom', () => {
            console.error('Room is full or game has started');
            alert('Room is full or game has already started. Please try another room.');
        });

        socket.on('error:wrongPassword', () => {
            console.error('Wrong password for private room');
            alert('Incorrect password for private room.');
        });

        socket.on('player:data', data => {
            console.log('Received player data:', data);
            data = JSON.parse(data);
            setPlayerData(data);
            if (data.roomId != null) {
                setRedirect(true);
            }
        });
        
        setPlayerSocket(socket);
        
        return () => {
            clearTimeout(connectionTimeout);
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={playerSocket}>
            <Router>
                <Routes>
                    <Route
                        exact
                        path='/'
                        Component={() => {
                            if (connectionError) {
                                return (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '100vh',
                                        backgroundColor: '#1e3c72',
                                        color: 'white',
                                        textAlign: 'center'
                                    }}>
                                        <h2>Connection Error</h2>
                                        <p>Failed to connect to the game server</p>
                                        <button 
                                            onClick={() => window.location.reload()}
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                backgroundColor: '#4CAF50',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Retry Connection
                                        </button>
                                    </div>
                                );
                            } else if (redirect) {
                                return <Navigate to='/game' />;
                            } else if (playerSocket) {
                                return <LoginPage />;
                            } else {
                                return <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />;
                            }
                        }}
                    ></Route>
                    <Route
                        path='/login'
                        Component={() => {
                            if (redirect) {
                                return <Navigate to='/game' />;
                            } else if (playerSocket) {
                                return <LoginPage />;
                            } else {
                                return <ReactLoading type='spinningBubbles' color='white' height={667} width={375} />;
                            }
                        }}
                    ></Route>
                    <Route
                        path='/game'
                        Component={() => {
                            if (playerData) {
                                return (
                                    <PlayerDataContext.Provider value={playerData}>
                                        <Gameboard />
                                    </PlayerDataContext.Provider>
                                );
                            } else {
                                return <Navigate to='/login' />;
                            }
                        }}
                    ></Route>
                </Routes>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
