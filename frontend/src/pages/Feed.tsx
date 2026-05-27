import { useState, useEffect, useMemo } from 'react';
import { PostCard } from '../components/feed/PostCard';
import { useI18n } from '../hooks/useI18n';
import { useNavigation } from '../hooks/useNavigation';
import { fetchApi } from '../utils/api';
import styles from './Feed.module.css';

interface Post {
  id: number;
  username: string;
  content: string;
  category: string;
  created_at: string;
  likes: number;
  is_liked: number;
  comments: number; // INI YANG SEBELUMNYA TERLEWAT
}

// DAFTAR KATEGORI DENGAN LOGO VEKTOR GARIS (SVG LINE-ART) MINIMALIS
const CATEGORY_TABS = [
  { 
    id: 'all', 
    label: 'Semua', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
      </svg>
    ) 
  },
  { 
    id: 'kuliner', 
    label: 'Kuliner', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/>
      </svg>
    ) 
  },
  { 
    id: 'loker', 
    label: 'Loker', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ) 
  },
  { 
    id: 'curhat', 
    label: 'Curhat', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ) 
  },
  { 
    id: 'liburan', 
    label: 'Liburan', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
    ) 
  },
  { 
    id: 'gaming', 
    label: 'Gaming', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><rect x="2" y="6" width="20" height="12" rx="3"/>
      </svg>
    ) 
  },
  { 
    id: 'teknologi', 
    label: 'Teknologi', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    ) 
  },
  { 
    id: 'kampus', 
    label: 'Kampus', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2.7 3.5 6 3.5s6-1.5 6-3.5v-5"/>
      </svg>
    ) 
  },
  { 
    id: 'jualbeli', 
    label: 'Jual Beli', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ) 
  },
  { 
    id: 'event', 
    label: 'Event', 
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ) 
  }
];

export const Feed = () => {
  const { t } = useI18n();
  const { setCurrentTab } = useNavigation();
  const [activeTab, setActiveTab] = useState('foryou');
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchApi('/api/posts');
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleLike = async (postId: number) => {
    setPosts(currentPosts => currentPosts.map(p => {
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
    } catch (error) {
      console.error("Gagal menyukai postingan:", error);
    }
  };

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter(post => post.category === activeCategory);
  }, [posts, activeCategory]);

  return (
    <div className={styles.feedContainer}>
      <div className={styles.tabs}>
        <button 
          className={`interactive-element ${styles.tabBtn} ${activeTab === 'foryou' ? styles.active : ''}`}
          onClick={() => setActiveTab('foryou')}
        >
          {t.feed.foryou}
        </button>
        <button 
          className={`interactive-element ${styles.tabBtn} ${activeTab === 'latest' ? styles.active : ''}`}
          onClick={() => setActiveTab('latest')}
        >
          {t.feed.latest}
        </button>
      </div>

      <div className={styles.categoryScroll}>
        {CATEGORY_TABS.map(cat => (
          <div
            key={cat.id}
            className={`${styles.catItem} ${activeCategory === cat.id ? styles.active : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <div className={styles.catIcon}>{cat.icon}</div>
            <span className={styles.catLabel}>{cat.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.postList}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
             <span style={{ color: 'var(--text-tertiary)', fontWeight: 500, letterSpacing: '2px' }}>● ● ●</span>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: '16px' }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ margin: 0, fontWeight: 600 }}>Belum ada postingan di kategori ini.</p>
          </div>
        ) : (
          filteredPosts.map((post, index) => {
            const dateObj = new Date(post.created_at);
            const timeStr = `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
            
            return (
              <div key={`${post.id}-${activeCategory}`} className="animate-card" style={{ animationDelay: `${index * 0.05}s` }}>
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
        )}
      </div>

      <button className={`interactive-element ${styles.fab}`} onClick={() => setCurrentTab('compose')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5l0 14" />
          <path d="M5 12l14 0" />
        </svg>
      </button>
    </div>
  );
};