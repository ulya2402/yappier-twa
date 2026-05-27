import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { fetchApi } from '../utils/api';
import { PostCard } from '../components/feed/PostCard';
import styles from './Profile.module.css';

interface ProfileData {
  username: string;
  is_premium?: boolean;
  total_posts: number;
  total_followers: number;
  total_following: number;
}

interface Post {
  id: number;
  username: string;
  content: string;
  category: string;
  created_at: string;
  likes: number;
  is_liked: number;
  comments: number;
}

export const Profile = () => {
  const { user } = useAuth();
  const { t } = useI18n(user?.language as any);
  const [activeTab, setActiveTab] = useState('posts');
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileInfo = await fetchApi('/api/profile');
        setProfileData(profileInfo);
        const userPosts = await fetchApi('/api/posts?mine=true');
        setMyPosts(Array.isArray(userPosts) ? userPosts : []);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading && myPosts.length > 0) {
      const timer = setTimeout(() => setAnimate(true), 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, myPosts]);

  const handleLike = async (postId: number) => {
    setMyPosts(currentPosts => currentPosts.map(p => {
      if (p.id === postId) {
        const isCurrentlyLiked = !!p.is_liked;
        return {
          ...p,
          is_liked: isCurrentlyLiked ? 0 : 1,
          likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
    try {
      await fetchApi('/api/like', { method: 'POST', body: JSON.stringify({ postId }) });
    } catch (error) {}
  };

  const displayUsername = profileData?.username || user?.username || 'User';
  const initial = displayUsername.charAt(0).toUpperCase();
  const isPremium = profileData?.is_premium || user?.is_premium;

  return (
    <div className={styles.profileContainer}>
      {/* HEADER PROFIL */}
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
          {/* TANGGAL BERGABUNG YANG ELEGAN */}
          <div className={styles.joinDate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Bergabung Mei 2026
          </div>
        </div>
        
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{isLoading ? "-" : profileData?.total_posts || 0}</span>
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

      {/* TAB MENU */}
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

      {/* KONTEN (DAFTAR POSTINGAN) */}
      <div className={styles.contentGrid}>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '40px' }}>● ● ●</div>
        ) : activeTab === 'posts' ? (
          myPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="15" />
                <line x1="15" y1="9" x2="9" y2="15" />
              </svg>
              <p>Anda belum membuat postingan.</p>
            </div>
          ) : (
            myPosts.map((post, index) => {
              const dateObj = new Date(post.created_at);
              const timeStr = `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
              
              return (
                <div 
                  key={post.id} 
                  className={`${styles.cardWrapper} ${animate ? styles.cardVisible : ''}`} 
                  style={{ transitionDelay: `${index * 0.04}s` }}
                >
                  <PostCard 
                    id={post.id}
                    username={post.username}
                    content={post.content}
                    time={timeStr}
                    category={post.category}
                    likes={post.likes || 0}
                    comments={post.comments || 0}
                    isLiked={!!post.is_liked}
                    onLike={handleLike}
                  />
                </div>
              );
            })
          )
        ) : (
          <div className={styles.emptyState}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>Belum ada media.</p>
          </div>
        )}
      </div>
    </div>
  );
};