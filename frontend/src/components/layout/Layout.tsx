import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import styles from '../../styles/Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <h1 className={styles.headerTitle}>Yappier.</h1>
        {/* Tombol bintang di kanan telah dihapus sepenuhnya sesuai instruksi */}
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>

      <BottomNav />
    </div>
  );
};