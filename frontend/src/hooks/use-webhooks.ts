import { useState, useEffect } from "react";
import webhookAPI, { type WebhookConfig } from "@/api/webhooks";

export function useWebhooks() {
  const [config, setConfig] = useState<WebhookConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhook = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await webhookAPI.getWebhook();
      setConfig(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load webhook");
    } finally {
      setLoading(false);
    }
  };

  const update = async (url: string) => {
    try {
      await webhookAPI.updateWebhook(url);
      await fetchWebhook();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to update");
      return false;
    }
  };

  const remove = async () => {
    try {
      await webhookAPI.deleteWebhook();
      await fetchWebhook();
      return true;
    } catch {
      return false;
    }
  };

  const test = async () => {
    try {
      const res = await webhookAPI.testWebhook();
      return res.data.delivered;
    } catch {
      return false;
    }
  };

  useEffect(() => { fetchWebhook(); }, []);

  return { config, loading, error, update, remove, test, refresh: fetchWebhook };
}