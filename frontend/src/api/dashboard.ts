// src/api/dashboard.ts
import apiClient from "./client";

export interface DashboardStats {
  total_logins: number;
  blocked_logins: number;
  otp_triggered: number;
  allowed_logins: number;
  unique_users: number;
  avg_risk_score: number;
  period: string;
}

export interface LoginLog {
  user_id: string;
  ip: string;
  device_fp: string;
  resource: string;
  score: number;
  decision: string;
  explanation: string;
  timestamp: string;
  country?: string;
  city?: string;
}

export interface UserDNA {
  user_id: string;
  avg_login_hour: number;
  common_devices: string[];
  common_locations: string[];
  common_resources: string[];
  login_count: number;
  last_seen: string;
}

const dashboardAPI = {
  getStats: async (period?: string): Promise<DashboardStats> => {
    const params: Record<string, string> = {};
    if (period) params.period = period;
    const response = await apiClient.get("/v1/dashboard/stats", { params });
    return response.data;
  },

  getLogs: async (options?: { limit?: number; userId?: string }): Promise<LoginLog[]> => {
    const params: Record<string, string | number> = { limit: options?.limit || 50 };
    if (options?.userId) params.user_id = options.userId;
    const response = await apiClient.get("/v1/dashboard/logs", { params });
    return response.data;
  },

  getAllUsers: async (): Promise<UserDNA[]> => {
    const response = await apiClient.get("/v1/dashboard/users");
    return response.data;
  },

  getUserDNA: async (userId: string): Promise<UserDNA> => {
    const response = await apiClient.get(
      `/v1/dashboard/users/${encodeURIComponent(userId)}/dna`
    );
    return response.data;
  },
};

export default dashboardAPI;