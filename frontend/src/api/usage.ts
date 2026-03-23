// src/api/usage.ts
import apiClient from "./client";

export interface CurrentUsage {
  tenant_id: string;
  tier: string;
  period: string;
  total_calls_this_month: number;
  hourly_rate_limit: number;
  hourly_calls_used: number;
  hourly_remaining: number;
  breakdown: {
    allow: number;
    block: number;
    otp: number;
    stepup: number;
  };
  avg_latency_ms: number;
  avg_risk_score: number;
}

export interface UsageHistoryEntry {
  period: string;
  total_calls: number;
  block_count: number;
  allow_count: number;
  avg_latency_ms: number;
}

export interface UsageHistory {
  tenant_id: string;
  history: UsageHistoryEntry[];
}

const usageAPI = {
  getCurrentUsage: async (): Promise<CurrentUsage> => {
    const response = await apiClient.get("/v1/usage/current");
    return response.data;
  },

  getUsageHistory: async (months: number = 6): Promise<UsageHistory> => {
    const response = await apiClient.get("/v1/usage/history", {
      params: { months },
    });
    return response.data;
  },
};

export default usageAPI;