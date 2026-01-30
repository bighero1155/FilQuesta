// src/utils/axiosInstance.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { getRuntimeConfig } from "../config/runtimeConfig";

let activeRequests = 0;

const dispatchLoading = (isLoading: boolean) => {
  window.dispatchEvent(
    new CustomEvent("apiLoading", { detail: { isLoading } })
  );
};

/**
 * ✅ CRITICAL FIX:
 * Set baseURL at creation time
 */
const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true,
});

// -----------------------------
// REQUEST INTERCEPTOR
// -----------------------------
AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipLoading?: boolean }) => {
    const skipLoading = config.skipLoading;

    if (!skipLoading) {
      activeRequests++;
      if (activeRequests === 1) dispatchLoading(true);
    }

    // Ensure headers exist (Axios v1 safe)
    config.headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    // Inject token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // Content-Type
    if (config.data instanceof FormData) {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    /**
     * OPTIONAL fallback (safe to keep)
     * This will NEVER remove /api anymore
     */
    if (!config.baseURL) {
      try {
        config.baseURL = getRuntimeConfig().apiBaseUrl;
      } catch {
        // ignore
      }
    }

    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) dispatchLoading(false);
    return Promise.reject(error);
  }
);

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
AxiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) dispatchLoading(false);
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) dispatchLoading(false);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
