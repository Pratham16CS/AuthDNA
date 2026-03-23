// src/api/auth.ts
import apiClient from "./client";

export interface TenantInfo {
  tenant_id: string;
  company_name: string;
  email: string;
  tier: string;
  created_at: string;
  is_active: boolean;
  webhook_url: string | null;
  total_api_calls: number;
}

export interface RegisterPayload {
  companyName: string;
  email: string;
  adminSecret: string;
  tier?: string;
  webhookUrl?: string | null;
}

export interface RegisterResponse {
  tenant_id: string;
  company_name: string;
  api_key: string;
  tier: string;
  rate_limit: number;
  message: string;
}

export interface RotateKeyResponse {
  new_api_key: string;
  message: string;
}

const authAPI = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const response = await apiClient.post("/v1/tenants/register", {
      company_name: payload.companyName,
      email: payload.email,
      admin_secret: payload.adminSecret,
      tier: payload.tier || "free",
      webhook_url: payload.webhookUrl || null,
    });

    const data: RegisterResponse = response.data;

    localStorage.setItem("authdna_api_key", data.api_key);
    localStorage.setItem(
      "authdna_tenant",
      JSON.stringify({
        tenant_id: data.tenant_id,
        company_name: data.company_name,
        tier: data.tier,
        rate_limit: data.rate_limit,
      })
    );

    return data;
  },

  loginWithApiKey: async (apiKey: string): Promise<TenantInfo> => {
    localStorage.setItem("authdna_api_key", apiKey);

    try {
      const response = await apiClient.get("/v1/tenants/me");
      const tenant: TenantInfo = response.data;
      localStorage.setItem("authdna_tenant", JSON.stringify(tenant));
      return tenant;
    } catch {
      localStorage.removeItem("authdna_api_key");
      localStorage.removeItem("authdna_tenant");
      throw new Error("Invalid API key. Please check and try again.");
    }
  },

  getTenantInfo: async (): Promise<TenantInfo> => {
    const response = await apiClient.get("/v1/tenants/me");
    return response.data;
  },

  rotateKey: async (): Promise<RotateKeyResponse> => {
    const response = await apiClient.post("/v1/tenants/rotate-key");
    const data: RotateKeyResponse = response.data;
    localStorage.setItem("authdna_api_key", data.new_api_key);
    return data;
  },

  logout: () => {
    localStorage.removeItem("authdna_api_key");
    localStorage.removeItem("authdna_tenant");
    window.location.href = "/login";
  },

  isAuthenticated: (): boolean => {
    return !!(
      localStorage.getItem("authdna_api_key") &&
      localStorage.getItem("authdna_tenant")
    );
  },

  getStoredTenant: (): TenantInfo | null => {
    const raw = localStorage.getItem("authdna_tenant");
    return raw ? JSON.parse(raw) : null;
  },

  getMaskedApiKey: (): string | null => {
    const key = localStorage.getItem("authdna_api_key");
    if (!key) return null;
    return key.substring(0, 10) + "••••••••" + key.substring(key.length - 4);
  },

  healthCheck: async () => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};

export default authAPI;