import axios from "../auth/axiosInstance";

const API_URL = "/users";

// =======================
// User Services
// =======================
export const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getUserProfile = async (userId: number) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const addUser = async (userData: any) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export const updateUser = async (userId: number, userData: any) => {
  const response = await axios.put(`${API_URL}/${userId}`, userData);
  return response.data.user;
};

export const deleteUser = async (userId: number) => {
  return axios.delete(`${API_URL}/${userId}`);
};

// =======================
// Progress Service
// =======================
export const updateUserProgress = async (userId: number, score: number) => {
  try {
    // Get the current user to retrieve current total_score
    const { data: currentUser } = await axios.get(`${API_URL}/${userId}`);
    const currentTotal = currentUser.total_score || 0;

    // Add the new score
    const newTotal = currentTotal + score;

    // Update total_score in the database
    const response = await axios.put(`${API_URL}/${userId}/score`, { total_score: newTotal });

    // Also update localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    storedUser.total_score = newTotal;
    localStorage.setItem("user", JSON.stringify(storedUser));
    localStorage.setItem("total_score", String(newTotal));

    return response.data;
  } catch (error) {
    console.error("Failed to update user progress:", error);
    throw error;
  }
};

// =======================
// Unlocked Levels Service
// =======================
export const updateUnlockedLevels = async (userId: number, levels: number[]) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/progress`, { unlocked_levels: levels });

    // Update localStorage as well
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    storedUser.unlocked_levels = levels;
    localStorage.setItem("user", JSON.stringify(storedUser));

    return response.data;
  } catch (error) {
    console.error("Failed to update unlocked levels:", error);
    throw error;
  }
};

// =======================
// Role-based fetchers
// =======================
export const getStudents = async () => {
  const response = await axios.get(`${API_URL}?role=student`);
  return response.data;
};

export const getTeachers = async () => {
  const response = await axios.get(`${API_URL}?role=teacher`);
  return response.data;
};

// =======================
// Update Score (Shared Quiz)
// =======================
export const addSharedQuizScore = async (
  userId: number,
  earnedScore: number
) => {
  try {
    const { data: currentUser } = await axios.get(`${API_URL}/${userId}`);
    const currentTotal = currentUser.total_score || 0;

    const newTotal = currentTotal + earnedScore;

    const response = await axios.put(`${API_URL}/${userId}/score`, {
      total_score: newTotal,
    });

    // update local storage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    storedUser.total_score = newTotal;
    localStorage.setItem("user", JSON.stringify(storedUser));

    return response.data;
  } catch (err) {
    console.error("Failed to update shared quiz score:", err);
    throw err;
  }
};