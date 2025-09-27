import React, { useState, useContext } from 'react';
import { SocketContext } from '../../../App';
import Switch from '@mui/material/Switch';
import styles from './ReadyButton.module.css';

const ReadyButton = ({ isReady }) => {
    const socket = useContext(SocketContext);
    const [checked, setChecked] = useState(isReady);

    const handleCheckboxChange = () => {
        socket.emit('player:ready');
        setChecked(!checked);
    };
    return (
        <div className={styles.container}>
            <Switch onChange={handleCheckboxChange} checked={checked || false} />
            <label>{checked ? 'Ready to play!' : 'Click to join game'}</label>
        </div>
    );
};

export default ReadyButton;
