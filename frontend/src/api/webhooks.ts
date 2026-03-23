// src/api/webhooks.ts
import apiClient from "./client";

export interface WebhookConfig {
  webhook_url: string | null;
  events: string[];
  status: string;
}

const webhookAPI = {
  getWebhook: async (): Promise<WebhookConfig> => {
    const response = await apiClient.get("/v1/webhooks/");
    return response.data;
  },

  updateWebhook: async (webhookUrl: string) => {
    const response = await apiClient.put("/v1/webhooks/", {
      webhook_url: webhookUrl,
    });
    return response.data;
  },

  deleteWebhook: async () => {
    const response = await apiClient.delete("/v1/webhooks/");
    return response.data;
  },

  testWebhook: async () => {
    const response = await apiClient.post("/v1/webhooks/test");
    return response.data;
  },
};

export default webhookAPI;