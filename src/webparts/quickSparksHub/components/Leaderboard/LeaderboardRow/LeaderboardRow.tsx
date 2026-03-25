import * as React from 'react';
import { ILeaderboardEntry } from '../../../models/ILeaderboardEntry';
import styles from './LeaderboardRow.module.scss';

interface ILeaderboardRowProps {
    entry: ILeaderboardEntry;
    index: number;
}

const LeaderboardRow: React.FC<ILeaderboardRowProps> = ({ entry, index }) => {
    const isTop3 = entry.rank <= 3;
    const delay = `${index * 50}ms`;

    return (
        <li className={styles.row} style={{ animationDelay: delay }}>
            <span className={isTop3 ? styles.rankTop : styles.rank}>{entry.rank}</span>
            <div className={styles.info}>
                <p className={styles.division}>{entry.division}</p>
                <div className={styles.barContainer}>
                    <div className={styles.barFill} style={{ width: `${Math.min(entry.participationRate, 100)}%` }} />
                </div>
            </div>
            <span className={styles.rate}>{entry.participationRate}%</span>
        </li>
    );
};

export default LeaderboardRow;
