import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { fetchApi } from '../utils/api';
import styles from './Compose.module.css';

const CATEGORIES = [
  { id: 'kuliner', label: 'Kuliner' },
  { id: 'loker', label: 'Loker' },
  { id: 'curhat', label: 'Curhat' },
  { id: 'liburan', label: 'Liburan' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'teknologi', label: 'Teknologi' },
  { id: 'kampus', label: 'Kampus' },
  { id: 'jualbeli', label: 'Jual Beli' },
  { id: 'event', label: 'Event' }
];

export const Compose = () => {
  const { setCurrentTab } = useNavigation();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('curhat'); // Default kategori
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Otomatis fokus ke area ketik saat halaman dibuka
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await fetchApi('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content, category })
      });
      setCurrentTab('feed');
    } catch (error) {
      console.error("Gagal membuat postingan:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.composeContainer}>
      {/* HEADER 3 KOLOM PRESISI */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.cancelBtn} onClick={() => setCurrentTab('feed')}>
            Batal
          </button>
        </div>
        
        <div className={styles.headerCenter}>
          <h2 className={styles.headerTitle}>Buat Postingan</h2>
        </div>
        
        <div className={styles.headerRight}>
          <button 
            className={styles.submitBtn} 
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            <span>Kirim</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </header>

      {/* AREA KETIK */}
      <div className={styles.inputArea}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Apa yang sedang terjadi?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {/* KAPSUL KATEGORI */}
      <div className={styles.categorySection}>
        <h3 className={styles.categoryTitle}>Pilih Kategori</h3>
        <div className={styles.categoryList}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.categoryPill} ${category === cat.id ? styles.activePill : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};