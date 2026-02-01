// src/services/cosmeticService.ts
import axios from "../auth/axiosInstance";

const API_URL = "/cosmetics";

/** Helper: include Bearer token for auth-protected routes */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Helper: Get base URL for images */
const getImageBaseUrl = (): string => {
  // Try environment variable first
  const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
  
  if (envBaseUrl) {
    // Remove /api suffix if present 
    return envBaseUrl.replace(/\/api$/, '');
  }
  
  // Check if in development mode
  if (import.meta.env.DEV) {
    return "http://10.0.29.189:8000";
  }
  
  // Production: use current origin
  return window.location.origin;
};

/** Helper: Convert image path to full URL */
export const getImageUrl = (imagePath?: string | File): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath instanceof File) return undefined;
  
  // Already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // 🔥 FIX: Handle /assets paths - these are FRONTEND static files
  // Return as-is because they're relative to the React app, not the backend
  if (imagePath.startsWith('/assets')) {
    return imagePath; // e.g., "/assets/teacher2.jpg"
  }
  
  // For all other paths, use backend base URL
  const baseUrl = getImageBaseUrl();
  
  // Remove leading slash if present for processing
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  
  // Handle assets/ without leading slash
  if (cleanPath.startsWith('assets/')) {
    return `/${cleanPath}`; // Convert to "/assets/..."
  }
  
  // 🔥 FIX: Handle paths that already have 'storage/' prefix
  if (cleanPath.startsWith('storage/')) {
    return `${baseUrl}/${cleanPath}`;
  }
  
  // 🔥 FIX: Cosmetics go to storage/cosmetics/
  if (cleanPath.startsWith('cosmetics/')) {
    return `${baseUrl}/storage/${cleanPath}`;
  }
  
  // 🔥 FIX: Handle avatars specifically
  if (cleanPath.startsWith('avatars/')) {
    return `${baseUrl}/storage/${cleanPath}`;
  }
  
  // 🔥 Default: Add 'storage/' prefix for other paths
  return `${baseUrl}/storage/${cleanPath}`;
};

/** Helper: Dispatch custom event when user data changes */
const dispatchUserUpdateEvent = () => {
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("avatarUpdated"));
};

/** ===============================
 *  TYPES
 *  =============================== */
export interface Cosmetic {
  cosmetic_id?: number;
  type: "avatar" | "badge" | "nick_frame";
  name: string;
  description?: string;
  price: number;
  image?: File | string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCosmetic {
  user_cosmetic_id?: number;
  user_id?: number;
  cosmetic_id: number;
  is_equipped: boolean;
  // Flat fields returned by the backend's userCosmetics endpoint
  type?: string;
  name?: string;
  image?: string;
  // Only present on raw pivot rows, NOT on the mapped userCosmetics response
  cosmetic?: Cosmetic;
}

/** ===============================
 *  ADMIN CRUD OPERATIONS
 *  =============================== */

/** Fetch all cosmetics */
export const getCosmetics = async (): Promise<Cosmetic[]> => {
  const response = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });
  
  // Transform image paths to full URLs
  const cosmetics = response.data.map((cosmetic: Cosmetic) => ({
    ...cosmetic,
    image: typeof cosmetic.image === 'string' ? getImageUrl(cosmetic.image) : cosmetic.image,
  }));
  
  return cosmetics;
};

/** Create a new cosmetic */
export const createCosmetic = async (cosmetic: Cosmetic) => {
  const formData = new FormData();
  formData.append("type", cosmetic.type);
  formData.append("name", cosmetic.name);
  formData.append("description", cosmetic.description || "");
  formData.append("price", cosmetic.price.toString());
  if (cosmetic.image instanceof File) {
    formData.append("image", cosmetic.image);
  }

  const response = await axios.post(API_URL, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  
  // Transform image path to full URL
  if (response.data.image && typeof response.data.image === 'string') {
    response.data.image = getImageUrl(response.data.image);
  }
  
  return response.data;
};

/** Update an existing cosmetic */
export const updateCosmetic = async (id: number, cosmetic: Cosmetic) => {
  const formData = new FormData();
  formData.append("type", cosmetic.type);
  formData.append("name", cosmetic.name);
  formData.append("description", cosmetic.description || "");
  formData.append("price", cosmetic.price.toString());
  if (cosmetic.image instanceof File) {
    formData.append("image", cosmetic.image);
  }

  // Laravel-compatible method override
  formData.append("_method", "PUT");

  const response = await axios.post(`${API_URL}/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
  
  // Transform image path to full URL
  if (response.data.image && typeof response.data.image === 'string') {
    response.data.image = getImageUrl(response.data.image);
  }
  
  return response.data;
};

/** Delete a cosmetic */
export const deleteCosmetic = async (id: number) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** ===============================
 *  USER-FACING SHOP OPERATIONS
 *  =============================== */

/** Get cosmetics owned by a specific user */
export const getUserCosmetics = async (
  userId: number
): Promise<UserCosmetic[]> => {
  if (!userId) throw new Error("User ID is undefined");
  const response = await axios.get(`/users/${userId}/cosmetics`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  
  // The backend's userCosmetics endpoint returns a FLAT array:
  // { cosmetic_id, type, name, image, is_equipped }
  // NOT a nested { cosmetic_id, is_equipped, cosmetic: { ... } }
  // So we transform the top-level image field directly.
  const userCosmetics = response.data.map((uc: UserCosmetic) => ({
    ...uc,
    image: typeof uc.image === 'string' ? getImageUrl(uc.image) : uc.image,
  }));
  
  return userCosmetics;
};

/** Buy a cosmetic (deducts coins and saves ownership) */
export const buyCosmetic = async (cosmeticId: number) => {
  const response = await axios.post(
    `${API_URL}/buy`,
    { cosmetic_id: cosmeticId },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  
  // Dispatch event to update UI components
  dispatchUserUpdateEvent();
  
  return response.data;
};

/** Equip a cosmetic (sets it as active) */
export const equipCosmetic = async (cosmeticId: number) => {
  const response = await axios.post(
    `${API_URL}/equip`,
    { cosmetic_id: cosmeticId },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  
  // Dispatch event to update UI components
  dispatchUserUpdateEvent();
  
  return response.data;
};

/** Unequip a cosmetic */
export const unequipCosmetic = async (cosmeticId: number) => {
  const response = await axios.post(
    `${API_URL}/unequip`,
    { cosmetic_id: cosmeticId },
    {
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      withCredentials: true,
    }
  );
  
  // Dispatch event to update UI components
  dispatchUserUpdateEvent();
  
  return response.data;
};

/** Get equipped cosmetics for a user */
export const getEquippedCosmetics = async (userId: number) => {
  if (!userId) throw new Error("User ID is undefined");
  const response = await axios.get(`/users/${userId}/cosmetics/equipped`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  
  // Transform image paths to full URLs
  const equippedCosmetics = response.data.map((cosmetic: Cosmetic) => ({
    ...cosmetic,
    image: typeof cosmetic.image === 'string' ? getImageUrl(cosmetic.image) : cosmetic.image,
  }));
  
  return equippedCosmetics;
};