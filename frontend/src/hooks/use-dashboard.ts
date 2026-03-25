import { useState, useEffect } from "react";
import dashboardAPI, { type DashboardStats, type LoginLog, type UserProfile } from "@/api/dashboard";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardAPI.getStats();
      setStats(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return { stats, loading, error, refresh: fetchStats };
}

export function useLogs(userId?: string, limit: number = 50) {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { limit };
      if (userId) params.user_id = userId;
      const res = await dashboardAPI.getLogs(params);
      setLogs(res.data.logs || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [userId, limit]);

  return { logs, loading, error, refresh: fetchLogs };
}

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await dashboardAPI.getUsers();
      setUsers(res.data.users || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  return { users, loading, error, refresh: fetchUsers };
}