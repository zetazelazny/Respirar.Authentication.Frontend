import React, { createContext, useEffect, useState } from 'react';
import { environment } from '@/environments/env';
import { useRouter } from 'next/router';

interface SessionContextType {
  isAuthenticated: boolean;
  getAccessToken: () => string | null;
  logout: () => void;
  checkAuthentication: () => void;
  setAuth:() => void;
}

const SessionContext = createContext<SessionContextType>({
  isAuthenticated: false,
  getAccessToken() {
    return sessionStorage.getItem('accessToken')
  },
  logout() {},
  checkAuthentication() {},
  setAuth() {},
});

interface SessionProviderProps {
  children: React.ReactNode;
  shouldCheckAuth?: boolean;
}

const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  shouldCheckAuth = true,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(undefined)
  const router = useRouter();
  

  const checkAuthentication = async () => {
    try {
      const response = await fetch(environment.backendUrl + '/validateToken', {
          method: "GET",
          headers: {
              "Accept": "application/json",
              'Content-Type': 'application/json',
              'acces-token': sessionStorage.getItem('accessToken') ?? ''
          },
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/login')
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      router.push('/login')
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(environment.backendUrl + '/validateToken', {
            method: "GET",
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'acces-token': sessionStorage.getItem('accessToken') ?? ''
            },
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldCheckAuth) {
      checkAuthentication();
    } else {
      setIsLoading(false);
    }
  }, [shouldCheckAuth]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getAccessToken = () => {
    return sessionStorage.getItem('accessToken')
  }

  const setAccessTokenAuth = (accessTokenString: string) => {
    return sessionStorage.setItem('accessToken', accessTokenString)
  }

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('username');
    
    router.push('/login');
  };

  const setAuth = () =>{
    setIsAuthenticated(true);
  }

  return (
    <SessionContext.Provider value={{ isAuthenticated, getAccessToken, logout, checkAuthentication, setAuth }}>
      {children}
    </SessionContext.Provider>
  );
};

export { SessionContext, SessionProvider };
