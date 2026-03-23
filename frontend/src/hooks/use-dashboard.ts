// src/hooks/use-dashboard.ts
import { useState, useEffect, useCallback } from "react";
import dashboardAPI, { type DashboardStats, type LoginLog, type UserDNA } from "@/api/dashboard";

export function useDashboard(period?: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardAPI.getStats(period);
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load stats");
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}

export function useLogs(options?: { limit?: number; userId?: string }) {
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardAPI.getLogs(options);
      setLogs(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to load logs");
    } finally {
      setIsLoading(false);
    }
  }, [options?.limit, options?.userId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { logs, isLoading, error, refetch: fetchLogs };
}

export function useUsers() {
  const [users, setUsers] = useState<UserDNA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dashboardAPI.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return { users, isLoading, error, refetch: fetchUsers };
}

export function useUserDNA(userId: string | undefined) {
  const [dna, setDna] = useState<UserDNA | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDNA = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardAPI.getUserDNA(userId);
      setDna(data);
    } catch (err: any) {
      setError(err.response?.status === 404
        ? "No DNA profile yet. Created after first login evaluation."
        : "Failed to load DNA profile");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchDNA(); }, [fetchDNA]);

  return { dna, isLoading, error, refetch: fetchDNA };
}