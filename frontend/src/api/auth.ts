import apiClient from './client';

export const registerTenant = (data: {
  company_name: string; email: string; admin_secret: string;
  tier: string; webhook_url?: string;
}) => apiClient.post('/v1/tenants/register', data);

export const getMe = () => apiClient.get('/v1/tenants/me');

export const rotateKey = () => apiClient.post('/v1/tenants/rotate-key');