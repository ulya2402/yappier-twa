import { useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { NavigationProvider, useNavigation } from './hooks/useNavigation';
import { Layout } from './components/layout/Layout';
import { Feed } from './pages/Feed';
import { Compose } from './pages/Compose';
import { Profile } from './pages/Profile';
import { Notifications } from './pages/Notifications';
import { PostDetail } from './pages/PostDetail'; // TAMBAHKAN IMPORT INI
import './styles/theme.css';

const ViewRenderer = () => {
  const { currentTab } = useNavigation();

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
        
        // Memaksa warna header Telegram menjadi putih bersih
        const whiteColor = '#ffffff';
        
        if (tg.setHeaderColor) {
          tg.setHeaderColor(whiteColor);
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor(whiteColor);
        }
      }
    } catch (err) {
      console.error("Telegram UI init error:", err);
    }
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', height: '100dvh', justifyContent: 'center', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Loading...</span>
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