import * as React from 'react';
import { TABS, TabId } from '../../../utils/constants';
import styles from './TabNav.module.scss';

interface ITabNavProps {
    activeTab: TabId;
    onTabChange: (tab: TabId) => void;
}

const TabNav: React.FC<ITabNavProps> = ({ activeTab, onTabChange }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        const currentIndex = TABS.indexOf(activeTab);
        let nextIndex = -1;

        if (e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % TABS.length;
        } else if (e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        }

        if (nextIndex !== -1) {
            e.preventDefault();
            onTabChange(TABS[nextIndex]);
        }
    };

    return (
        <div className={styles.tabNav} role="tablist" aria-label="quicksparks sections" onKeyDown={handleKeyDown}>
            {TABS.map((tab) => (
                <button
                    type="button"
                    key={tab}
                    role="tab"
                    aria-selected={tab === activeTab}
                    tabIndex={tab === activeTab ? 0 : -1}
                    className={tab === activeTab ? styles.tabActive : styles.tab}
                    onClick={() => onTabChange(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default TabNav;
