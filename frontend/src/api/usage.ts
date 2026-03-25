import apiClient from './client';

export interface CurrentUsage {
  period: string;
  total_calls: number;
  allow_count: number;
  block_count: number;
  otp_count: number;
  stepup_count: number;
  avg_latency_ms: number;
  avg_score: number;
  hourly_rate: number;
  hourly_limit: number;
  remaining: number;
  tier: string;
}

export interface UsageHistory {
  period: string;
  total_calls: number;
  allow_count: number;
  block_count: number;
  otp_count: number;
  stepup_count: number;
  avg_latency_ms: number;
  avg_score: number;
}

export const getCurrentUsage = () =>
  apiClient.get<CurrentUsage>('/v1/usage/current');

export const getUsageHistory = () =>
  apiClient.get<{ history: UsageHistory[] }>('/v1/usage/history');

const usageAPI = { getCurrentUsage, getUsageHistory };
export default usageAPI;