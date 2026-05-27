import styles from './PostCard.module.css';
import { useNavigation } from '../../hooks/useNavigation';

interface CommentPreview {
  username: string;
  content: string;
}

interface PostCardProps {
  id: number;
  username: string;
  content: string;
  time: string;
  category?: string;
  likes: number;
  comments: number;
  commentPreviews?: CommentPreview[]; // TAMBAHAN: Data cuplikan komentar
  isLiked: boolean;
  onLike: (id: number) => void;
  onCommentClick?: () => void;
}

export const PostCard = ({ id, username, content, time, category, likes, comments, commentPreviews, isLiked, onLike, onCommentClick }: PostCardProps) => {
  const { setCurrentTab, setActivePostId } = useNavigation();
  const initial = username ? username.charAt(0).toUpperCase() : 'U';

  const getCategoryLabel = (cat?: string) => {
    switch(cat) {
      case 'kuliner': return 'Kuliner';
      case 'loker': return 'Loker';
      case 'curhat': return 'Curhat';
      case 'liburan': return 'Liburan';
      case 'gaming': return 'Gaming';
      case 'teknologi': return 'Teknologi';
      case 'kampus': return 'Kampus';
      case 'jualbeli': return 'Jual Beli';
      case 'event': return 'Event';
      default: return 'Umum';
    }
  };

  const handleOpenDetail = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setActivePostId(id);
    setCurrentTab('post_detail');
  };

  return (
    <article className={styles.card} onClick={handleOpenDetail}>
      <header className={styles.header}>
        <div className={styles.avatar}>{initial}</div>
        <div className={styles.meta}>
          <h3 className={styles.username}>{username}</h3>
          <span className={styles.time}>{time}</span>
        </div>
        {category && <div className={styles.categoryBadge}>{getCategoryLabel(category)}</div>}
      </header>
      
      <p className={styles.content}>{content}</p>

      {/* --- ARTSY COMMENT PREVIEW --- */}
      {commentPreviews && commentPreviews.length > 0 && (
        <div className={styles.commentPreviewSection}>
          {commentPreviews.map((c, i) => (
            <div key={i} className={styles.previewItem}>
              <span className={styles.previewUser}>{c.username}</span>
              <span className={styles.previewText}>{c.content}</span>
            </div>
          ))}
          {comments > 2 && (
            <span className={styles.viewMore}>Lihat semua {comments} komentar...</span>
          )}
        </div>
      )}
      
      <footer className={styles.actions}>
        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onLike(id); }} style={{ color: isLiked ? '#ef4444' : 'var(--text-tertiary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {likes > 0 && <span>{likes}</span>}
        </button>
        
        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onCommentClick ? onCommentClick() : handleOpenDetail(e); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          {comments > 0 && <span>{comments}</span>}
        </button>

        <button className={styles.actionBtn} style={{ marginLeft: 'auto' }} onClick={(e) => e.stopPropagation()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </button>
      </footer>
    </article>
  );
};