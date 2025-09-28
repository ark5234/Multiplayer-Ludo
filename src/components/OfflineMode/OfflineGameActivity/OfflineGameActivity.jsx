import React from 'react';
import styles from './OfflineGameActivity.module.css';

const OfflineGameActivity = ({ activities }) => {
    return (
        <div className={styles.activityContainer}>
            <h3 className={styles.title}>📝 Game Activity</h3>
            
            <div className={styles.activitiesList}>
                {activities.length === 0 ? (
                    <div className={styles.noActivity}>
                        <span className={styles.emptyIcon}>🎲</span>
                        <span className={styles.emptyText}>Game will start soon!</span>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className={styles.activityItem}>
                            <div className={styles.activityTime}>
                                {activity.timestamp}
                            </div>
                            <div className={styles.activityMessage}>
                                {activity.message}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OfflineGameActivity;