import { useNavigation } from '../../hooks/useNavigation';
import styles from '../../styles/Layout.module.css';

export const BottomNav = () => {
  const { currentTab, setCurrentTab } = useNavigation();

  const handleNav = (tab: any) => {
    console.log("Navigating to:", tab);
    setCurrentTab(tab);
  };

  return (
    <nav className={styles.bottomNav}>
      <button 
        className={`${styles.navItem} ${currentTab === 'feed' ? styles.active : ''}`}
        onClick={() => handleNav('feed')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
      </button>
      
      <button 
        className={`${styles.navItem} ${currentTab === 'compose' ? styles.active : ''}`}
        onClick={() => handleNav('compose')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'notifications' ? styles.active : ''}`}
        onClick={() => handleNav('notifications')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
          <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
        </svg>
      </button>

      <button 
        className={`${styles.navItem} ${currentTab === 'profile' ? styles.active : ''}`}
        onClick={() => handleNav('profile')}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </button>
    </nav>
  );
};