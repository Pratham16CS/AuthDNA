// src/api/evaluate.ts
import apiClient from "./client";

export interface EvaluatePayload {
  userId: string;
  ip: string;
  deviceFp: string;
  resource?: string;
  failedAttempts?: number;
  userAgent?: string | null;
  timestamp?: string | null;
}

export interface RiskFactor {
  factor: string;
  contribution: number;
  description: string;
}

export interface EvaluateResponse {
  decision: "ALLOW" | "OTP" | "STEPUP" | "BLOCK";
  score: number;
  explanation: string;
  risk_factors: RiskFactor[];
  dna_match: number;
  is_new_user: boolean;
  processing_time_ms: number;
  request_id: string;
  timestamp: string;
}

export interface Preset {
  userId: string;
  ip: string;
  deviceFp: string;
  resource: string;
  failedAttempts: number;
  label: string;
}

const evaluateAPI = {
  evaluateLogin: async (payload: EvaluatePayload): Promise<EvaluateResponse> => {
    const body: Record<string, unknown> = {
      user_id: payload.userId,
      ip: payload.ip,
      device_fp: payload.deviceFp,
      resource: payload.resource || "general",
      failed_attempts: payload.failedAttempts || 0,
    };

    if (payload.userAgent) body.user_agent = payload.userAgent;
    if (payload.timestamp) body.timestamp = payload.timestamp;

    const response = await apiClient.post("/v1/evaluate", body);
    return response.data;
  },

  presets: {
    normalLogin: {
      userId: "alice@demo.com",
      ip: "49.36.128.100",
      deviceFp: "chrome-win-1920x1080",
      resource: "profile",
      failedAttempts: 0,
      label: "Normal Login",
    },
    newDevice: {
      userId: "alice@demo.com",
      ip: "49.36.128.100",
      deviceFp: "firefox-linux-1366x768",
      resource: "settings",
      failedAttempts: 0,
      label: "New Device",
    },
    impossibleTravel: {
      userId: "alice@demo.com",
      ip: "185.220.100.252",
      deviceFp: "chrome-win-1920x1080",
      resource: "financial_data",
      failedAttempts: 0,
      label: "Impossible Travel",
    },
    bruteForce: {
      userId: "alice@demo.com",
      ip: "203.0.113.42",
      deviceFp: "chrome-win-1920x1080",
      resource: "admin_panel",
      failedAttempts: 8,
      label: "Brute Force",
    },
    worstCase: {
      userId: "alice@demo.com",
      ip: "185.220.100.252",
      deviceFp: "unknown-device-000",
      resource: "financial_data",
      failedAttempts: 10,
      label: "Everything Bad",
    },
  } as Record<string, Preset>,
};

export default evaluateAPI;