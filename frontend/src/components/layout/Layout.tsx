import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { useTheme } from '../../hooks/useTheme'; // Import hook baru kita
import styles from '../../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, toggleTheme } = useTheme(); // Gunakan fungsi toggle

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        {/* KIRI: Tombol Toggle Tema */}
        <div className={styles.headerLeft}>
          <button className={styles.themeToggleBtn} onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>

        {/* TENGAH: Logo Terkunci Persis di Tengah */}
        <div className={styles.headerCenter}>
          <h1 className={styles.headerTitle}>Yappier.</h1>
        </div>

        {/* KANAN: Penyeimbang agar Center benar-benar akurat */}
        <div className={styles.headerRight}></div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
};