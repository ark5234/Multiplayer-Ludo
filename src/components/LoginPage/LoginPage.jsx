import React from 'react';
import { Link } from 'react-router-dom';
import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        <div className={styles.container}>
            <div className={styles.offlineModeSection}>
                <h2 className={styles.offlineTitle}>🎲 Play Offline</h2>
                <p className={styles.offlineDescription}>
                    Play with friends in person! Pass the device between players.
                </p>
                <Link to="/offline" className={styles.offlineButton}>
                    🚀 Start Offline Game
                </Link>
            </div>
            
            <div className={styles.divider}>
                <span>or</span>
            </div>
            
            <div className={styles.onlineModeSection}>
                <h2 className={styles.onlineTitle}>🌐 Play Online</h2>
                <JoinServer />
                <AddServer />
            </div>
        </div>
    );
};

export default LoginPage;
