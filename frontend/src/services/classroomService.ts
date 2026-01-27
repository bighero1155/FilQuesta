import AxiosInstance from "../auth/axiosInstance";

export interface Classroom {
  classroom_id: number;
  teacher_id: number;
  title: string;
  code: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  students?: Student[];
}

export interface Student {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: "student";
}

const classroomService = {
  /** Get classrooms for a teacher */
  async getTeacherClassrooms(teacherId: number) {
    const res = await AxiosInstance.get(`/teacher/${teacherId}/classrooms`);
    return res.data;
  },

  /** Get classrooms for a student */
  async getStudentClassrooms(studentId: number) {
    const res = await AxiosInstance.get(`/student/${studentId}/classrooms`);
    return res.data;
  },

  /** Get single classroom by ID */
  async getById(classroomId: number) {
    const res = await AxiosInstance.get(`/classrooms/${classroomId}`);
    return res.data;
  },

  /** Create new classroom */
  async create(data: Partial<Classroom>) {
    const res = await AxiosInstance.post("/classrooms", data);
    return res.data;
  },

  /** Student joins a classroom using code */
  async join(code: string, studentId: number) {
    const res = await AxiosInstance.post("/classrooms/join", {
      code,
      student_id: studentId,
    });
    return res.data;
  },

  /** Student leaves a classroom */
  async leave(classroomId: number, studentId: number) {
    const res = await AxiosInstance.delete(`/classrooms/${classroomId}/students/${studentId}`);
    return res.data;
  },

  /** Teacher removes a student from classroom */
  async removeStudent(classroomId: number, studentId: number) {
    const res = await AxiosInstance.delete(`/classrooms/${classroomId}/students/${studentId}`);
    return res.data;
  },
};

export default classroomService;