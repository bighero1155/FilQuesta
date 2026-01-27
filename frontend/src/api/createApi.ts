// src/api/createApi.ts
import AxiosInstance from "../auth/axiosInstance";
import { AxiosRequestConfig } from "axios";

/**
 * Options for API wrapper
 */
interface CreateApiOptions<T = any> {
  /**
   * Override baseURL for this API (backup server, CDN, etc.)
   */
  baseURL?: string;

  /**
   * Fallback when offline or request fails
   */
  offlineFallback?: () => Promise<T> | T;

  /**
   * Cache key for GET requests
   */
  cacheKey?: string;

  /**
   * Cache TTL in ms (default: 5 minutes)
   */
  cacheTTL?: number;
}

/**
 * Simple cache wrapper using localStorage
 */
const getCache = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data as T;
  } catch {
    return null;
  }
};

const setCache = <T>(key: string, data: T, ttl: number) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        expiry: Date.now() + ttl,
      })
    );
  } catch {
    // ignore quota errors
  }
};

/**
 * API factory
 */
export const createApi =
  <T = any>(options?: CreateApiOptions<T>) =>
  async (config: AxiosRequestConfig): Promise<T> => {
    const {
      baseURL,
      offlineFallback,
      cacheKey,
      cacheTTL = 5 * 60 * 1000, // 5 minutes
    } = options || {};

    // -----------------------------
    // OFFLINE MODE
    // -----------------------------
    if (!navigator.onLine) {
      if (cacheKey) {
        const cached = getCache<T>(cacheKey);
        if (cached !== null) return cached;
      }

      if (offlineFallback) {
        return await offlineFallback();
      }

      throw new Error("Offline and no fallback available");
    }

    try {
      const response = await AxiosInstance({
        ...config,
        baseURL: baseURL ?? config.baseURL,
      });

      const data = response.data as T;

      // Cache successful GET responses
      if (config.method?.toLowerCase() === "get" && cacheKey) {
        setCache(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      // -----------------------------
      // FAILURE FALLBACK
      // -----------------------------
      if (cacheKey) {
        const cached = getCache<T>(cacheKey);
        if (cached !== null) return cached;
      }

      if (offlineFallback) {
        return await offlineFallback();
      }

      throw error;
    }
  };
