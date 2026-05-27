import { useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NavigationProvider, useNavigation } from './hooks/useNavigation';
import { Layout } from './components/layout/Layout';
import { Feed } from './pages/Feed';
import { Compose } from './pages/Compose';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { PostDetail } from './pages/PostDetail';
import './styles/theme.css';

const ViewRenderer = () => {
  const { currentTab, setCurrentTab, setActivePostId } = useNavigation();

  // PENGATURAN SWIPE BACK & TOMBOL KEMBALI NATIVE TELEGRAM
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;

    // Fungsi jika tombol 'Kembali' Telegram atau Swipe Kiri ditekan
    const handleBack = () => {
      if (currentTab === 'post_detail') {
        setCurrentTab('feed');
        setActivePostId(null);
      } else if (currentTab !== 'feed') {
        setCurrentTab('feed');
      }
    };

    // Tampilkan tombol back jika bukan di beranda
    if (currentTab !== 'feed') {
      tg.BackButton.show();
      tg.BackButton.onClick(handleBack);
    } else {
      tg.BackButton.hide();
      tg.BackButton.offClick(handleBack);
    }

    return () => {
      tg.BackButton.offClick(handleBack);
    };
  }, [currentTab, setCurrentTab, setActivePostId]);

  const renderContent = () => {
    switch (currentTab) {
      case 'compose':
        return <Compose />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      case 'post_detail':
        return <PostDetail />;
      case 'feed':
      default:
        return <Feed />;
    }
  };

  return (
    <div key={currentTab} className="page-transition" style={{ flex: 1 }}>
      {renderContent()}
    </div>
  );
};

const MainShell = () => {
  const { isLoading, error } = useAuth();

  useEffect(() => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.expand();
        if (tg.disableVerticalSwipes) {
          tg.disableVerticalSwipes();
        }
        // KODE WARNA PUTIH DIHAPUS DARI SINI
      }
    } catch (err) {
      console.error("Telegram UI init error:", err);
    }
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100dvh', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '2px' }}>● ● ●</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <h2>App Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <Layout>
      <ViewRenderer />
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <MainShell />
      </NavigationProvider>
    </AuthProvider>
  );
}