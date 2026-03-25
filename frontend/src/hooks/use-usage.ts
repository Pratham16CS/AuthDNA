import { useState, useEffect } from "react";
import usageAPI, { type CurrentUsage, type UsageHistory } from "@/api/usage";

export function useUsage() {
  const [current, setCurrent] = useState<CurrentUsage | null>(null);
  const [history, setHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [curRes, histRes] = await Promise.all([
        usageAPI.getCurrentUsage(),
        usageAPI.getUsageHistory(),
      ]);
      setCurrent(curRes.data);
      setHistory(histRes.data.history || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load usage");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  return { current, history, loading, error, refresh: fetch };
}