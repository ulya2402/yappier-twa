import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../utils/api';

interface User {
  id: number;
  telegram_id: string;
  username: string;
  is_premium: boolean;
  language: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const tg = (window as any).Telegram?.WebApp;
        
        if (!tg) {
          throw new Error("Telegram WebApp object not found");
        }

        tg.ready();
        tg.expand();
        
        if (tg.setHeaderColor) {
          tg.setHeaderColor(tg.colorScheme === 'light' ? '#f5f5f5' : '#070707');
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor(tg.colorScheme === 'light' ? '#f5f5f5' : '#070707');
        }
        
        const initData = tg.initData;

        if (!initData) {
          throw new Error("initData is empty");
        }

        const response = await fetch(`${API_BASE_URL}/api/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }),
        });

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err: any) {
        console.error("Authentication Error", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);