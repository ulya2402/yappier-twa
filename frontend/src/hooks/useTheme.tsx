import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Membaca tema dari penyimpanan HP saat aplikasi pertama kali dibuka
  useEffect(() => {
    const savedTheme = localStorage.getItem('yappier_theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Menyesuaikan otomatis dengan mode HP (Dark/Light mode system)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Menerapkan perubahan warna ke seluruh aplikasi & Telegram Bar
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('yappier_theme', theme);
    
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        // Menerapkan palet warna Anda ke bar bawaan Telegram
        const bgColor = theme === 'dark' ? '#383838' : '#f7f7f7';
        if (tg.setHeaderColor) tg.setHeaderColor(bgColor);
        if (tg.setBackgroundColor) tg.setBackgroundColor(bgColor);
      }
    } catch (e) {
      console.error("Gagal mengubah warna Telegram UI");
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return { theme, toggleTheme };
};