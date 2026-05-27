import { useState, useEffect, useRef } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { fetchApi } from '../utils/api';
import { PostCard } from '../components/feed/PostCard';
import styles from './PostDetail.module.css';

interface Comment {
  id: number;
  username: string;
  content: string;
  created_at: string;
  parent_id?: number | null; // Kolom penentu balasan
}

export const PostDetail = () => {
  const { setCurrentTab, activePostId } = useNavigation();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // STATE BARU: Mengingat siapa yang sedang dibalas
  const [replyTo, setReplyTo] = useState<{id: number, username: string} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!activePostId) {
      setCurrentTab('feed');
      return;
    }

    const loadData = async () => {
      try {
        const allPosts = await fetchApi('/api/posts');
        const currentPost = Array.isArray(allPosts) 
          ? allPosts.find((p: any) => Number(p.id) === Number(activePostId)) 
          : null;
        setPost(currentPost);

        const commentsData = await fetchApi(`/api/comments?postId=${activePostId}`);
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } catch (error) {
        console.error("Gagal memuat detail:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activePostId, setCurrentTab]);

  const handleLike = async () => {
    if (!post) return;
    const isCurrentlyLiked = !!post.is_liked;
    setPost({
      ...post,
      is_liked: isCurrentlyLiked ? 0 : 1,
      likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1
    });

    try {
      await fetchApi('/api/like', {
        method: 'POST',
        body: JSON.stringify({ postId: activePostId })
      });
    } catch (error) {}
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || isSubmitting || !activePostId) return;
    setIsSubmitting(true);
    
    try {
      await fetchApi('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ 
          postId: Number(activePostId), 
          content: newComment,
          parentId: replyTo?.id || null // Kirim ID induk jika sedang membalas
        })
      });
      
      const commentsData = await fetchApi(`/api/comments?postId=${activePostId}`);
      setComments(Array.isArray(commentsData) ? commentsData : []);
      setNewComment('');
      setReplyTo(null); // Reset setelah sukses mengirim
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "--:--";
    const d = new Date(isoString.replace(' ', 'T'));
    if (isNaN(d.getTime())) return "--:--";
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontWeight: 600 }}>● ● ●</div>;
  if (!post) return <div style={{ padding: '40px', textAlign: 'center' }}><p>Postingan tidak ditemukan.</p><button onClick={() => setCurrentTab('feed')}>Kembali</button></div>;

  // Memisahkan komentar utama dan balasan
  const parentComments = comments.filter(c => !c.parent_id);

  return (
    <div className={styles.detailContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => setCurrentTab('feed')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
        
        <div className={styles.headerCenter}>
          <h2 className={styles.headerTitle}>Percakapan</h2>
        </div>
        
        <div className={styles.headerRight}></div>
      </header>

      <div className={styles.scrollArea}>
        <div className={styles.originalPost}>
          <PostCard 
            id={post.id}
            username={post.username}
            content={post.content}
            time={formatTime(post.created_at)}
            category={post.category}
            likes={post.likes || 0}
            comments={comments.length}
            isLiked={!!post.is_liked}
            onLike={handleLike}
            onCommentClick={() => { setReplyTo(null); inputRef.current?.focus(); }}
          />
        </div>

        <div className={styles.commentsSection}>
          {parentComments.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginTop: '40px', fontSize: '13px', fontWeight: 500 }}>
              Belum ada balasan. Jadilah yang pertama membalas!
            </p>
          ) : (
            parentComments.map(comment => {
              const authorName = comment.username || 'User';
              const childReplies = comments.filter(c => c.parent_id === comment.id);

              return (
                <div key={comment.id} className={styles.commentThread}>
                  {/* KOMENTAR INDUK */}
                  <div className={styles.commentItem}>
                    <div className={styles.avatar}>{authorName.charAt(0).toUpperCase()}</div>
                    <div className={styles.commentBody}>
                      <div className={styles.commentMeta}>
                        <span className={styles.commentAuthor}>{authorName}</span>
                        <span className={styles.commentTime}>{formatTime(comment.created_at)}</span>
                      </div>
                      <p className={styles.commentText}>{comment.content}</p>
                      <button 
                        className={styles.replyBtn} 
                        onClick={() => { setReplyTo({id: comment.id, username: authorName}); inputRef.current?.focus(); }}
                      >
                        Balas
                      </button>
                    </div>
                  </div>

                  {/* KOMENTAR ANAK (BALASAN) */}
                  {childReplies.length > 0 && (
                    <div className={styles.repliesContainer}>
                      {childReplies.map(reply => (
                        <div key={reply.id} className={styles.commentItem} style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                          <div className={styles.avatarSmall}>{reply.username.charAt(0).toUpperCase()}</div>
                          <div className={styles.commentBody}>
                            <div className={styles.commentMeta}>
                              <span className={styles.commentAuthor}>{reply.username}</span>
                              <span className={styles.commentTime}>{formatTime(reply.created_at)}</span>
                            </div>
                            <p className={styles.commentText}>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={styles.inputWrapper}>
        {/* INDIKATOR MEMBALAS */}
        {replyTo && (
          <div className={styles.replyIndicator}>
            Membalas <strong>@{replyTo.username}</strong>
            <button className={styles.cancelReplyBtn} onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}
        
        <div className={styles.inputRow}>
          <input 
            ref={inputRef}
            type="text" 
            className={styles.inputField} 
            placeholder={replyTo ? `Balas @${replyTo.username}...` : "Kirim balasan Anda..."} 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
            disabled={isSubmitting}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSendComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};