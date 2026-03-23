// src/api/client.ts
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach API key
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = localStorage.getItem("authdna_api_key");
    if (apiKey && config.headers) {
      config.headers["X-API-Key"] = apiKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          localStorage.removeItem("authdna_api_key");
          localStorage.removeItem("authdna_tenant");

          if (
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/register")
          ) {
            toast.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
          break;

        case 429:
          toast.error("Rate limit exceeded. Please wait and try again.", {
            description: `Your ${response.data?.detail?.tier || "current"} tier limit has been reached.`,
          });
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;
      }
    } else {
      toast.error("Network error — backend may be offline.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };