// src/hooks/use-usage.ts
import { useState, useEffect, useCallback } from "react";
import usageAPI, { type CurrentUsage, type UsageHistory } from "@/api/usage";

export function useUsage() {
  const [usage, setUsage] = useState<CurrentUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usageAPI.getCurrentUsage();
      setUsage(data);
    } catch {
      setError("Failed to load usage");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsage(); }, [fetchUsage]);

  return { usage, isLoading, error, refetch: fetchUsage };
}

export function useUsageHistory(months: number = 6) {
  const [history, setHistory] = useState<UsageHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await usageAPI.getUsageHistory(months);
      setHistory(data);
    } catch {
      setError("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  }, [months]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { history, isLoading, error, refetch: fetchHistory };
}