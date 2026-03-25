import apiClient from './client';

export interface WebhookConfig {
  url: string | null;
  active: boolean;
  events: string[];
}

export const getWebhook = () =>
  apiClient.get<WebhookConfig>('/v1/webhooks/');

export const updateWebhook = (url: string) =>
  apiClient.put<{ url: string; active: boolean }>('/v1/webhooks/', { url });

export const deleteWebhook = () =>
  apiClient.delete('/v1/webhooks/');

export const testWebhook = () =>
  apiClient.post<{ delivered: boolean; url: string }>('/v1/webhooks/test');

const webhookAPI = { getWebhook, updateWebhook, deleteWebhook, testWebhook };
export default webhookAPI;