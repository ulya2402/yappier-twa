import { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
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
  const { t } = useI18n();
  const { setCurrentTab } = useNavigation();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('tech');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      await fetchApi('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ content, category })
      });
      setContent('');
      setCurrentTab('feed');
    } catch (error: any) {
      console.error("Failed to post:", error);
      // Memunculkan pesan error teknis aslinya agar kita tahu penyakitnya
      alert("Gagal: " + (error.message || error)); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.composeContainer}>
      <textarea 
        className={styles.inputArea}
        placeholder={t.post?.placeholder || "Apa yang sedang terjadi?"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isSubmitting}
        autoFocus
      />

      <div className={styles.bottomSection}>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`interactive-element ${styles.categoryChip} ${category === cat.id ? styles.selected : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className={styles.toolbar}>
          {/* Ikon Lampiran (Image) */}
          <button className={`interactive-element ${styles.toolBtn}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 8h.01" />
              <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
              <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
              <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
            </svg>
          </button>
          
          {/* Tombol Kirim yang jauh lebih jelas */}
          <button 
            className={`interactive-element ${styles.submitBtn} ${content.trim() ? styles.active : ''}`}
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim'}
          </button>
        </div>
      </div>
    </div>
  );
};