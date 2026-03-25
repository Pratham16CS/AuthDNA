import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMe } from '@/api/auth';

interface Tenant {
  tenant_id: string;
  company_name: string;
  email: string;
  tier: string;
  total_api_calls: number;
  webhook_url?: string | null;
  is_active: boolean;
  key_prefix?: string;
}

interface AuthContextType {
  tenant: Tenant | null;
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (apiKey: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem('authdna_api_key')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (apiKey) {
      validate(apiKey);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function validate(key: string): Promise<boolean> {
    try {
      console.log(`🔐 Validating API key: ${key.substring(0, 20)}...`);
      localStorage.setItem('authdna_api_key', key);
      const resp = await getMe();
      console.log('✅ API key validated successfully');
      setTenant(resp.data);
      setApiKey(key);
      setIsLoading(false);
      return true;
    } catch (err: any) {
      console.error('❌ API key validation failed:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      setTenant(null);
      setApiKey(null);
      localStorage.removeItem('authdna_api_key');
      setIsLoading(false);
      return false;
    }
  }

  async function login(key: string): Promise<boolean> {
    setIsLoading(true);
    return await validate(key);
  }

  function logout() {
    setTenant(null);
    setApiKey(null);
    localStorage.removeItem('authdna_api_key');
  }

  return (
    <AuthContext.Provider
      value={{
        tenant,
        apiKey,
        isAuthenticated: !!tenant,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}