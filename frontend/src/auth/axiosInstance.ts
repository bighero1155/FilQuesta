// src/utils/axiosInstance.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";
import { getRuntimeConfig } from "../config/runtimeConfig";

let activeRequests = 0;

// Dispatch loading events
const dispatchLoading = (isLoading: boolean) => {
  window.dispatchEvent(
    new CustomEvent("apiLoading", { detail: { isLoading } })
  );
};

// Create axios instance WITHOUT baseURL
const AxiosInstance = axios.create();

// -----------------------------
// REQUEST INTERCEPTOR (Axios v1 safe)
// -----------------------------
AxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { skipLoading?: boolean }) => {
    const skipLoading = config.skipLoading;

    if (!skipLoading) {
      activeRequests++;
      if (activeRequests === 1) {
        dispatchLoading(true);
      }
    }

    // ✅ Ensure headers object exists (Axios v1 way)
    config.headers =
      config.headers instanceof AxiosHeaders
        ? config.headers
        : new AxiosHeaders(config.headers);

    // 🔑 Inject token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    // 🧠 Content-Type handling
    if (config.data instanceof FormData) {
      config.headers.set("Content-Type", "multipart/form-data");
    } else {
      config.headers.set("Content-Type", "application/json");
    }

    // 🌍 HYBRID baseURL resolution (runtime → env → fallback)
    if (!config.baseURL) {
      let runtimeBaseUrl: string | undefined;

      try {
        runtimeBaseUrl = getRuntimeConfig().apiBaseUrl;
      } catch {
        runtimeBaseUrl = undefined;
      }

      config.baseURL =
      runtimeBaseUrl ||
      import.meta.env.VITE_API_URL + "/api";
    }

    return config;
  },
  (error) => {
    const skipLoading = (error.config as any)?.skipLoading;

    if (!skipLoading) {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        dispatchLoading(false);
      }
    }

    return Promise.reject(error);
  }
);

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
AxiosInstance.interceptors.response.use(
  (response) => {
    const skipLoading = (response.config as any)?.skipLoading;

    if (!skipLoading) {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        dispatchLoading(false);
      }
    }

    return response;
  },
  (error) => {
    const skipLoading = (error.config as any)?.skipLoading;

    if (!skipLoading) {
      activeRequests = Math.max(0, activeRequests - 1);
      if (activeRequests === 0) {
        dispatchLoading(false);
      }
    }

    // 🔒 Auto logout on auth failure
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;
