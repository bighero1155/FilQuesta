// src/services/quizService.ts
import axios from "../auth/axiosInstance";

// === Types ===
export interface Option {
  option_id?: number;
  option_text: string;
  is_correct: boolean;
}

export interface Question {
  question_id?: number;
  question_text: string;
  question_image?: string | File;
  options?: Option[];
}

export interface Quiz {
  quiz_id?: number;
  teacher_id: number;
  title: string;
  description?: string;
  questions?: Question[];
}

export interface QuizAnswer {
  question_id: number;
  option_id?: number | null;
  text_answer?: string | null;
}

export interface QuizSubmissionPayload {
  student_id: number;
  answers: QuizAnswer[];
}

export interface QuizSubmissionResult {
  submission_id: number;
  score: number;
  total: number;
  correct_answers: number[];
  wrong_answers: number[];
}

export interface QuizResult {
  submission_id: number;
  student_id: number;
  first_name?: string;
  score: number;
  total: number;
  submitted_at: string;
}

export interface SharedQuizSession {
  quiz: any;
  session_id: number;
  quiz_id: number;
  teacher_id: number;
  code: string;
  duration_minutes: number;
  active: boolean;   
  started_at?: string | null;
}

export interface SharedQuizParticipant {
  id: number;
  session_id: number;
  student_id: number;
  score?: number;
  finished_at?: string | null;
  avatar?: string; 
  rank?: string;   
}

export interface SharedQuizReaction {
  id: number;
  session_id: number;
  emoji: string;
  created_at: string;
}

export interface SharedQuizSessionResponse {
  session: SharedQuizSession;
  reactions: SharedQuizReaction[];
}

export interface SharedQuizResultItem {
  student_id: number;
  student_name: string;
  score: number;
  avatar?: string;
  finished_at: string | null;
}
export interface QuizReviewQuestion {
  question_id: number;
  question_text: string;
  question_image?: string;
  is_identification: boolean;
  options: Option[];
  student_answer: number | string | null;
  correct_answer: number | string;
  is_correct: boolean;
}

export interface QuizReviewData {
  participant?: {
    student_id: number;
    score: number;
    finished_at: string;
  };
  submission?: {
    submission_id: number;
    student_id: number;
    score: number;
    submitted_at: string;
  };
  quiz_title: string;
  total_questions: number;
  questions: QuizReviewQuestion[];
}

// Helper function to extract storage path from full URL
const extractStoragePath = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If it's already just a path, return as-is
  if (!imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Remove the storage URL prefix to get just the path
  const storagePrefix = '/storage/';
  
  if (imagePath.includes(storagePrefix)) {
    const parts = imagePath.split(storagePrefix);
    return parts[parts.length - 1];
  }
  
  return imagePath;
};

// === QUICK QUIZZES ===
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const res = await axios.get("/quizzes");
  return res.data;
};

export const getQuiz = async (quizId: number): Promise<Quiz> => {
  const res = await axios.get(`/quizzes/${quizId}`);
  return res.data;
};

export const createQuiz = async (quiz: Quiz): Promise<Quiz> => {
  const formData = new FormData();
  
  formData.append("teacher_id", quiz.teacher_id.toString());
  formData.append("title", quiz.title); 
  if (quiz.description) {
    formData.append("description", quiz.description);
  }

  if (quiz.questions) {
    quiz.questions.forEach((question, qIndex) => {
      formData.append(`questions[${qIndex}][question_text]`, question.question_text);
      
      if (question.question_image instanceof File) {
        formData.append(`questions[${qIndex}][question_image]`, question.question_image);
      }

      if (question.options) {
        question.options.forEach((option, oIndex) => {
          formData.append(`questions[${qIndex}][options][${oIndex}][option_text]`, option.option_text);
          formData.append(`questions[${qIndex}][options][${oIndex}][is_correct]`, option.is_correct ? "1" : "0");
        });
      }
    });
  }

  const res = await axios.post("/quizzes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateQuiz = async (
  quizId: number,
  quiz: Partial<Quiz>
): Promise<Quiz> => {
  const formData = new FormData();
  
  if (quiz.title) {
    formData.append("title", quiz.title);
  }
  if (quiz.description !== undefined) {
    formData.append("description", quiz.description || "");
  }

  if (quiz.questions) {
    quiz.questions.forEach((question, qIndex) => {
      formData.append(`questions[${qIndex}][question_text]`, question.question_text);
      
      // Handle new image upload (File object)
      if (question.question_image instanceof File) {
        formData.append(`questions[${qIndex}][question_image]`, question.question_image);
      } 
      // Keep existing image - extract just the storage path from URL
      else if (typeof question.question_image === 'string' && question.question_image) {
        const imagePath = extractStoragePath(question.question_image);
        formData.append(`questions[${qIndex}][existing_image]`, imagePath);
      }

      if (question.options) {
        question.options.forEach((option, oIndex) => {
          formData.append(`questions[${qIndex}][options][${oIndex}][option_text]`, option.option_text);
          formData.append(`questions[${qIndex}][options][${oIndex}][is_correct]`, option.is_correct ? "1" : "0");
        });
      }
    });
  }

  // Use POST with _method for file uploads
  formData.append("_method", "PUT");
  
  const res = await axios.post(`/quizzes/${quizId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data as Quiz;
};

export const deleteQuiz = async (quizId: number): Promise<void> => {
  await axios.delete(`/quizzes/${quizId}`);
};

export const assignQuiz = async (quizId: number, studentIds: number[]): Promise<void> => {
  await axios.post(`/quizzes/${quizId}/assign`, { student_ids: studentIds });
};

export const getStudentQuizzes = async (studentId: number): Promise<Quiz[]> => {
  const res = await axios.get(`/students/${studentId}/quizzes`);
  return res.data;
};

export const submitQuiz = async (quizId: number, submission: QuizSubmissionPayload): Promise<QuizSubmissionResult> => {
  const res = await axios.post(`/quizzes/${quizId}/submit`, submission);
  return res.data;
};

export const getQuizResults = async (quizId: number): Promise<QuizResult[]> => {
  const res = await axios.get(`/quizzes/${quizId}/results`);
  return res.data;
};

// === SHARED QUIZ SESSIONS ===

export const createSharedSession = async (
  quizId: number,
  teacherId: number,
  durationMinutes?: number
): Promise<SharedQuizSession> => {
  const res = await axios.post(`/quizzes/${quizId}/shared-sessions`, {
    teacher_id: teacherId,
    duration_minutes: durationMinutes,
  });
  return res.data;
};

export const joinSharedSession = async (
  code: string,
  studentId: number
): Promise<{ session: SharedQuizSession; participant: SharedQuizParticipant }> => {
  const res = await axios.post(`/shared-sessions/join`, {
    code,
    student_id: studentId,
  });
  return res.data;
};

export const startSharedSession = async (
  session_id: number
): Promise<{ message: string }> => {
  const res = await axios.post(`/shared-sessions/${session_id}/start`);
  return res.data;
};

// ✅ Skip loading for polling requests
export const getSharedSession = async (code: string): Promise<any> => {
  const res = await axios.get(`/shared-sessions/${code}`, {
    skipLoading: true,
  } as any);
  return res.data;
};

export const getSharedSessionResults = async (
  session_id: number
): Promise<SharedQuizResultItem[]> => {
  const res = await axios.get(`/shared-sessions/${session_id}/results`);
  return res.data;
};

export const submitSharedQuizAnswers = async (
  session_id: number,
  studentId: number,
  answers: Record<number, number | string | null>
): Promise<QuizSubmissionResult> => {
  const payload: QuizAnswer[] = Object.entries(answers).map(
    ([questionId, answer]) => {
      if (typeof answer === 'number') {
        return {
          question_id: Number(questionId),
          option_id: answer,
          text_answer: null,
        };
      } else if (typeof answer === 'string') {
        return {
          question_id: Number(questionId),
          option_id: null,
          text_answer: answer,
        };
      } else {
        return {
          question_id: Number(questionId),
          option_id: null,
          text_answer: null,
        };
      }
    }
  );

  const res = await axios.post(`/shared-sessions/${session_id}/submit`, {
    student_id: studentId,
    answers: payload,
  });

  return res.data;
};

export const stopSharedSession = async (
  session_id: number
): Promise<{ message: string }> => {
  const res = await axios.post(`/shared-sessions/${session_id}/stop`);
  return res.data;
};

export const getSharedSessions = async (): Promise<SharedQuizSession[]> => {
  const res = await axios.get("/shared-sessions");
  return res.data;
};

// ✅ Skip loading for reaction requests (they should be instant)
export const sendReaction = async (code: string, emoji: string): Promise<void> => {
  await axios.post(`/shared-sessions/${code}/reaction`, 
    { emoji },
    {
      skipLoading: true, 
    } as any
  );
};

export const isIdentificationQuestion = (question: Question): boolean => {
  return question.options?.length === 1;
};

export const deleteSharedSession = async (session_id: number): Promise<void> => {
  await axios.delete(`/shared-sessions/${session_id}`);
};

export const getSharedQuizReview = async (
  sessionId: number,
  studentId: number
): Promise<QuizReviewData> => {
  const res = await axios.get(`/shared-sessions/${sessionId}/review/${studentId}`);
  return res.data;
};

export const getQuizSubmissionReview = async (
  submissionId: number
): Promise<QuizReviewData> => {
  const res = await axios.get(`/quiz-submissions/${submissionId}/review`);
  return res.data;
};