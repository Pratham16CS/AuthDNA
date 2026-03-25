import apiClient from './client';

export interface EvaluateRequest {
  user_id: string;
  ip?: string;
  device_fp?: string;
  resource?: string;
  failed_attempts?: number;
  client_context?: Record<string, any>;
  role?: string;
  user_agent?: string;
  timestamp?: string;
}

export interface RiskFactor {
  factor: string;
  contribution: number;
  description: string;
}

export interface EvaluateResponse {
  decision: string;
  score: number;
  explanation: string;
  risk_factors: RiskFactor[];
  dna_match: number;
  is_new_user: boolean;
  processing_time_ms: number;
  request_id: string;
  timestamp: string;
}

export const evaluate = (data: EvaluateRequest) =>
  apiClient.post<EvaluateResponse>('/v1/evaluate', data);

const evaluateAPI = { evaluate };
export default evaluateAPI;