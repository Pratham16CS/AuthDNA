import apiClient from './client';

// Types
export interface DashboardStats {
  total_logins: number;
  blocked: number;
  otp_triggered: number;
  stepup_count: number;
  avg_risk_score: number;
  decisions: Record<string, number>;
  recent_evaluations: Array<{
    user_id: string;
    ip: string;
    country: string;
    score: number;
    decision: string;
    explanation: string;
    resource: string;
    timestamp: string;
  }>;
  usage: {
    hourly_rate: number;
    hourly_limit: number;
    remaining: number;
    total_this_month: number;
    avg_latency: number;
    tier: string;
  };
}

export interface LoginLog {
  user_id: string;
  ip: string;
  country: string;
  city: string;
  score: number;
  decision: string;
  explanation: string;
  resource: string;
  timestamp: string;
  device_fp: string;
  dna_match: number;
  is_new_user: boolean;
  processing_time_ms: number;
  request_id: string;
  risk_factors_json: string;
}

export interface UserProfile {
  user_id: string;
  login_count: number;
  devices: string[];
  locations: string[];
  last_seen: string;
}

export interface UserDNA {
  user_id: string;
  known_devices: string[];
  known_countries: string[];
  known_cities: string[];
  avg_login_hour: number;
  login_count: number;
  common_resources: string[];
  last_login_ip: string;
  last_login_country: string;
  last_login_timestamp: string;
  first_seen: string;
}

// API functions
export const getStats = () => 
  apiClient.get<DashboardStats>('/v1/dashboard/stats');

export const getLogs = (params?: { user_id?: string; limit?: number }) =>
  apiClient.get<{ logs: LoginLog[]; count: number }>('/v1/dashboard/logs', { params });

export const getUsers = () =>
  apiClient.get<{ users: UserProfile[] }>('/v1/dashboard/users');

export const getUserDna = (userId: string) =>
  apiClient.get<{ profile: UserDNA | null }>(`/v1/dashboard/users/${encodeURIComponent(userId)}/dna`);

// Default export for hooks that use `import dashboardAPI from ...`
const dashboardAPI = { getStats, getLogs, getUsers, getUserDna };
export default dashboardAPI;