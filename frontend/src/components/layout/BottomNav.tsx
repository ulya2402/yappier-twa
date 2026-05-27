import { useNavigation } from '../../hooks/useNavigation';
import styles from './BottomNav.module.css';

export const BottomNav = () => {
  const { currentTab, setCurrentTab } = useNavigation();

  // Menyembunyikan navigasi bawah saat masuk ke halaman detail agar bersih
  if (currentTab === 'post_detail') return null;

  return (
    <div className={styles.navWrapper}>
      <nav className={styles.navContainer}>
        {/* Tombol Beranda */}
        <button className={`${styles.navItem} ${currentTab === 'feed' ? styles.active : ''}`} onClick={() => setCurrentTab('feed')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </button>
        
        {/* Tombol Notifikasi */}
        <button className={`${styles.navItem} ${currentTab === 'notifications' ? styles.active : ''}`} onClick={() => setCurrentTab('notifications')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </button>

        {/* Tombol Tambah (+) Aksen Hitam/Putih di Tengah */}
        <button className={`${styles.navItem} ${styles.composeBtn}`} onClick={() => setCurrentTab('compose')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        
        {/* Tombol Profil */}
        <button className={`${styles.navItem} ${currentTab === 'profile' ? styles.active : ''}`} onClick={() => setCurrentTab('profile')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
      </nav>
    </div>
  );
};