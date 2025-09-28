import React from 'react';
import AddServer from './AddServer/AddServer';
import JoinServer from './JoinServer/JoinServer';
import styles from './LoginPage.module.css';

const LoginPage = () => {
    return (
        <div className={styles.container}>            
            <div className={styles.onlineModeSection}>
                <h2 className={styles.onlineTitle}>� Multiplayer Ludo</h2>
                <p className={styles.onlineDescription}>
                    Create or join a game room to play with friends online!
                </p>
                <JoinServer />
                <AddServer />
            </div>
        </div>
    );
};

export default LoginPage;
