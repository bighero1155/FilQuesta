// src/services/cosmeticService.ts
import axios from "../auth/axiosInstance";

/* ===============================
   🔒 BACKEND BASE URL (LOCKED)
   =============================== */

/**
 * Single source of truth for backend origin.
 * Images and API must ALWAYS come from the backend,
 * never from the frontend (Vercel).
 */
const getBackendBaseUrl = (): string => {
  // Prefer BASE URL (recommended)
  const base =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL;

  if (!base) {
    throw new Error(
      "❌ Missing backend URL. Define VITE_API_BASE_URL or VITE_API_URL in Vercel."
    );
  }

  // Strip /api if present
  return base.replace(/\/api$/, "");
};

/* ===============================
   🔒 IMAGE URL NORMALIZATION
   =============================== */

/**
 * Converts stored image paths into FINAL, SAFE URLs.
 * This function must be called EXACTLY ONCE per image.
 */
export const getImageUrl = (
  image?: string | File
): string | undefined => {
  if (!image) return undefined;
  if (image instanceof File) return undefined;

  // Already a full URL → trust it
  if (image.startsWith("https://") || image.startsWith("http://")) {
    return image;
  }

  // Frontend static assets (React public/)
  if (image.startsWith("/assets") || image.startsWith("assets/")) {
    return image.startsWith("/") ? image : `/${image}`;
  }

  const backend = getBackendBaseUrl();
  const cleanPath = image.startsWith("/") ? image.slice(1) : image;

  // Laravel public storage
  return `${backend}/storage/${cleanPath}`;
};

/* ===============================
   API HELPERS
   =============================== */

const API_URL = "/cosmetics";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** Notify app when user-related data changes */
const dispatchUserUpdateEvent = () => {
  window.dispatchEvent(new Event("userUpdated"));
  window.dispatchEvent(new Event("avatarUpdated"));
};

/* ===============================
   TYPES
   =============================== */

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
  cosmetic_id: number;
  is_equipped: boolean;
  type?: string;
  name?: string;
  image?: string;
}

/* ===============================
   ADMIN / CATALOG
   =============================== */

export const getCosmetics = async (): Promise<Cosmetic[]> => {
  const res = await axios.get(API_URL, {
    headers: getAuthHeaders(),
  });

  return res.data.map((c: Cosmetic) => ({
    ...c,
    image: typeof c.image === "string" ? getImageUrl(c.image) : c.image,
  }));
};

export const createCosmetic = async (cosmetic: Cosmetic) => {
  const formData = new FormData();
  formData.append("type", cosmetic.type);
  formData.append("name", cosmetic.name);
  formData.append("description", cosmetic.description || "");
  formData.append("price", cosmetic.price.toString());

  if (cosmetic.image instanceof File) {
    formData.append("image", cosmetic.image);
  }

  const res = await axios.post(API_URL, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  if (typeof res.data.image === "string") {
    res.data.image = getImageUrl(res.data.image);
  }

  return res.data;
};

export const updateCosmetic = async (id: number, cosmetic: Cosmetic) => {
  const formData = new FormData();
  formData.append("type", cosmetic.type);
  formData.append("name", cosmetic.name);
  formData.append("description", cosmetic.description || "");
  formData.append("price", cosmetic.price.toString());
  formData.append("_method", "PUT");

  if (cosmetic.image instanceof File) {
    formData.append("image", cosmetic.image);
  }

  const res = await axios.post(`${API_URL}/${id}`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });

  if (typeof res.data.image === "string") {
    res.data.image = getImageUrl(res.data.image);
  }

  return res.data;
};

export const deleteCosmetic = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

/* ===============================
   USER / SHOP
   =============================== */

export const getUserCosmetics = async (
  userId: number
): Promise<UserCosmetic[]> => {
  const res = await axios.get(`/users/${userId}/cosmetics`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return res.data.map((uc: UserCosmetic) => ({
    ...uc,
    image: typeof uc.image === "string" ? getImageUrl(uc.image) : uc.image,
  }));
};

export const buyCosmetic = async (cosmeticId: number) => {
  const res = await axios.post(
    `${API_URL}/buy`,
    { cosmetic_id: cosmeticId },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  dispatchUserUpdateEvent();
  return res.data;
};

export const equipCosmetic = async (cosmeticId: number) => {
  const res = await axios.post(
    `${API_URL}/equip`,
    { cosmetic_id: cosmeticId },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  dispatchUserUpdateEvent();
  return res.data;
};

export const unequipCosmetic = async (cosmeticId: number) => {
  const res = await axios.post(
    `${API_URL}/unequip`,
    { cosmetic_id: cosmeticId },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  dispatchUserUpdateEvent();
  return res.data;
};

export const getEquippedCosmetics = async (userId: number) => {
  const res = await axios.get(`/users/${userId}/cosmetics/equipped`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return res.data.map((c: Cosmetic) => ({
    ...c,
    image: typeof c.image === "string" ? getImageUrl(c.image) : c.image,
  }));
};
