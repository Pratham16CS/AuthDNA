// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import authAPI, { type TenantInfo, type RegisterPayload, type RegisterResponse } from "@/api/auth";
import { toast } from "sonner";

interface AuthContextType {
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  login: (apiKey: string) => Promise<TenantInfo>;
  logout: () => void;
  rotateKey: () => Promise<{ new_api_key: string; message: string }>;
  refreshTenant: () => Promise<void>;
  maskedApiKey: string | null;
  tenantId: string | undefined;
  companyName: string | undefined;
  tier: string | undefined;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate stored key on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      if (authAPI.isAuthenticated()) {
        try {
          const info = await authAPI.getTenantInfo();
          setTenant(info);
          setIsAuthenticated(true);
          localStorage.setItem("authdna_tenant", JSON.stringify(info));
        } catch {
          setTenant(null);
          setIsAuthenticated(false);
          localStorage.removeItem("authdna_api_key");
          localStorage.removeItem("authdna_tenant");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const data = await authAPI.register(payload);
      const info = await authAPI.getTenantInfo();
      setTenant(info);
      setIsAuthenticated(true);
      toast.success("Company registered successfully!");
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Registration failed";
      toast.error(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (apiKey: string) => {
    setIsLoading(true);
    try {
      const info = await authAPI.loginWithApiKey(apiKey);
      setTenant(info);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${info.company_name}!`);
      return info;
    } catch (err: any) {
      toast.error(err.message || "Invalid API key");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setTenant(null);
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
    authAPI.logout();
  }, []);

  const rotateKey = useCallback(async () => {
    const data = await authAPI.rotateKey();
    toast.success("API key rotated. Save your new key!");
    return data;
  }, []);

  const refreshTenant = useCallback(async () => {
    try {
      const info = await authAPI.getTenantInfo();
      setTenant(info);
      localStorage.setItem("authdna_tenant", JSON.stringify(info));
    } catch {
      console.error("Failed to refresh tenant");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        tenant,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
        rotateKey,
        refreshTenant,
        maskedApiKey: authAPI.getMaskedApiKey(),
        tenantId: tenant?.tenant_id,
        companyName: tenant?.company_name,
        tier: tenant?.tier,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}