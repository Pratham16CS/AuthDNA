// src/hooks/use-webhooks.ts
import { useState, useEffect, useCallback } from "react";
import webhookAPI, { type WebhookConfig } from "@/api/webhooks";
import { toast } from "sonner";

export function useWebhooks() {
  const [webhook, setWebhook] = useState<WebhookConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWebhook = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await webhookAPI.getWebhook();
      setWebhook(data);
    } catch {
      // Silently fail — webhook might not be configured
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWebhook = useCallback(async (url: string) => {
    const data = await webhookAPI.updateWebhook(url);
    toast.success("Webhook URL updated");
    await fetchWebhook();
    return data;
  }, [fetchWebhook]);

  const deleteWebhook = useCallback(async () => {
    await webhookAPI.deleteWebhook();
    toast.success("Webhook removed");
    await fetchWebhook();
  }, [fetchWebhook]);

  const testWebhook = useCallback(async () => {
    const data = await webhookAPI.testWebhook();
    if (data.success) {
      toast.success("Test webhook sent!");
    } else {
      toast.error("Webhook test failed");
    }
    return data;
  }, []);

  useEffect(() => { fetchWebhook(); }, [fetchWebhook]);

  return { webhook, isLoading, updateWebhook, deleteWebhook, testWebhook, refetch: fetchWebhook };
}