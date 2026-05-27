import { createContext, useContext, useState, ReactNode } from 'react';

// Tambahkan 'post_detail' ke dalam tipe tab
type TabType = 'feed' | 'compose' | 'notifications' | 'profile' | 'post_detail';

interface NavigationContextType {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  activePostId: number | null; // Tambahan: Mengingat ID postingan yang sedang dibuka
  setActivePostId: (id: number | null) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  currentTab: 'feed',
  setCurrentTab: () => {},
  activePostId: null,
  setActivePostId: () => {},
});

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<TabType>('feed');
  const [activePostId, setActivePostId] = useState<number | null>(null);

  return (
    <NavigationContext.Provider value={{ currentTab, setCurrentTab, activePostId, setActivePostId }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);