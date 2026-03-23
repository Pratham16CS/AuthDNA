// src/api/index.ts
export { default as apiClient } from "./client";
export { default as authAPI } from "./auth";
export { default as evaluateAPI } from "./evaluate";
export { default as dashboardAPI } from "./dashboard";
export { default as usageAPI } from "./usage";
export { default as webhookAPI } from "./webhooks";

export type { TenantInfo, RegisterPayload, RegisterResponse } from "./auth";
export type { EvaluatePayload, EvaluateResponse, RiskFactor, Preset } from "./evaluate";
export type { DashboardStats, LoginLog, UserDNA } from "./dashboard";
export type { CurrentUsage, UsageHistory } from "./usage";
export type { WebhookConfig } from "./webhooks";