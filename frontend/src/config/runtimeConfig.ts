// src/config/runtimeConfig.ts

export interface RuntimeConfig {
  apiBaseUrl: string;
}

let runtimeConfig: RuntimeConfig | null = null;

export const loadRuntimeConfig = async (): Promise<RuntimeConfig> => {
  if (runtimeConfig !== null) {
    return runtimeConfig;
  }

  const response = await fetch("/api/config", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load runtime config");
  }

  const data: RuntimeConfig = await response.json();
  runtimeConfig = data;

  return data;
};

export const getRuntimeConfig = (): RuntimeConfig => {
  if (runtimeConfig === null) {
    throw new Error(
      "Runtime config not loaded. Call loadRuntimeConfig() before using APIs."
    );
  }

  return runtimeConfig;
};
