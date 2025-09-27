import React, { useState, useContext } from 'react';
import Switch from '@mui/material/Switch';
import { SocketContext } from '../../../App';
import WindowLayout from '../WindowLayout/WindowLayout';
import useInput from '../../../hooks/useInput';
import styles from './AddServer.module.css';

const AddServer = () => {
    const socket = useContext(SocketContext);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const serverName = useInput('');
    const password = useInput('');

    const handleButtonClick = e => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        
        if (!serverName.value) {
            setIsIncorrect(true);
            return;
        }
        
        setIsSubmitting(true);
        setIsIncorrect(false);
        
        socket.emit('room:create', {
            name: serverName.value,
            password: password.value,
            private: isPrivate,
        });
        
        // Reset form after successful submission
        serverName.setValue('');
        password.setValue('');
        setIsPrivate(false);
        
        // Re-enable button after a delay
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <WindowLayout
            title='Host A Server'
            content={
                <form className={styles.formContainer}>
                    <input
                        type='text'
                        placeholder='Server Name'
                        {...serverName}
                        style={{
                            border: isIncorrect ? '1px solid red' : '1px solid white',
                        }}
                    />
                    <div className={styles.privateContainer}>
                        <label>Private</label>
                        <Switch checked={isPrivate} color='primary' onChange={() => setIsPrivate(!isPrivate)} />
                    </div>
                    <input type='text' placeholder='password' disabled={!isPrivate} {...password} />
                    <button 
                        onClick={handleButtonClick}
                        disabled={isSubmitting}
                        style={{
                            backgroundColor: isSubmitting ? '#666' : '',
                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSubmitting ? 'Creating...' : 'Host'}
                    </button>
                </form>
            }
        />
    );
};

export default AddServer;
