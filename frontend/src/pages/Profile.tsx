import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { fetchApi } from '../utils/api';
import styles from './Profile.module.css';

interface ProfileData {
  username: string;
  is_premium?: boolean;
  total_posts: number;
  total_followers: number;
  total_following: number;
}

export const Profile = () => {
  const { user } = useAuth();
  const { t } = useI18n(user?.language as any);
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchApi('/api/profile');
        setProfileData(data);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfileData();
  }, []);

  // Memprioritaskan data dari database API, menggunakan data Auth sebagai fallback sementara loading
  const displayUsername = profileData?.username || user?.username || 'User';
  const initial = displayUsername.charAt(0).toUpperCase();
  const isPremium = profileData?.is_premium || user?.is_premium;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.userInfo}>
          <h2 className={styles.username}>
            {displayUsername}
            {isPremium && (
              <span className={styles.premiumBadge} title="Telegram Premium">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-7.9 7.9z" />
                </svg>
              </span>
            )}
          </h2>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>
              {isLoading ? "-" : profileData?.total_posts || 0}
            </span>
            <span className={styles.statLabel}>{t.profile.posts}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>{t.profile.followers}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>0</span>
            <span className={styles.statLabel}>{t.profile.following}</span>
          </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button 
          className={`interactive-element ${styles.tabBtn} ${activeTab === 'posts' ? styles.active : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          {t.profile.posts}
        </button>
        <button 
          className={`interactive-element ${styles.tabBtn} ${activeTab === 'media' ? styles.active : ''}`}
          onClick={() => setActiveTab('media')}
        >
          {t.profile.media}
        </button>
      </div>

      <div className={styles.contentGrid}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '16px' }}>
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p style={{ margin: 0 }}>{t.profile.empty}</p>
      </div>
    </div>
  );
};