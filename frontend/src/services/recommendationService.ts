// src/services/recommendationService.ts
import AxiosInstance from "../auth/axiosInstance";
import axios from "axios";

const recommendationService = {
  /** Create a recommendation from teacher → student */
  async create(
    teacherId: number,
    studentId: number,
    gameLink: string,
    message?: string
  ) {
    const res = await AxiosInstance.post("/recommendations", {
      teacher_id: teacherId,
      student_id: studentId,
      game_link: gameLink,
      message,
    });
    return res.data;
  },

  /** Get all recommendations for a student */
  async getByStudent(studentId: number) {
    const res = await AxiosInstance.get(`/recommendations/student/${studentId}`, {
      skipLoading: true, // ✅ Skip loading for background polling
    } as any);
    return res.data;
  },

  /** Get all recommendations created by a teacher */
  async getByTeacher(teacherId: number) {
    const res = await AxiosInstance.get(`/recommendations/teacher/${teacherId}`);
    return res.data;
  },

  /** Mark all recommendations as read for a specific student */
  async markAsRead(studentId: number) {
    await AxiosInstance.put(`/recommendations/${studentId}/read`);
  },

  /** ✅ Delete a specific recommendation by ID */
  async delete(id: number) {
    const res = await AxiosInstance.delete(`/recommendations/${id}`);
    return res.data;
  },

  /** ✏️ Update a recommendation by ID */
  async update(id: number, data: { game_link: string; message?: string }) {
    const res = await AxiosInstance.put(`/recommendations/${id}`, data);
    return res.data;
  },
};

/* 🔹 For widget use (polling, etc.) */
export const getUserRecommendations = async (userId: number) => {
  const res = await AxiosInstance.get(`/recommendations/student/${userId}`, {
    skipLoading: true, // ✅ Skip loading for background polling
  } as any);
  return Array.isArray(res.data) ? res.data : res.data.recommendations || [];
};

export const createRecommendation = async (
  teacherId: number,
  studentId: number,
  gameLink: string
) => {
  const res = await axios.post("/api/recommendations", {
    teacher_id: teacherId,
    student_id: studentId,
    game_link: gameLink,
  });
  return res.data;
};

export const markRecommendationsRead = async (userId: number) => {
  await AxiosInstance.put(`/recommendations/${userId}/read`);
};

export default recommendationService;