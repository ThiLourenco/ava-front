import apiClient from './apiClient';
import { User, Course, CourseDetails, AuthCredentials, AuthResponse } from "./types";

export interface CreateCourseDTO {
  title: string;
  description: string;
  progress?: number;
  isFree: boolean;
  modules?: any[];
}

export const createCourse = async (data: CreateCourseDTO) => {
  const response = await apiClient.post("/courses", data);
  return response.data;
};

export const createModule = async (
  courseId: string,
  data: { title: string; order: number }
) => {
  const response = await apiClient.post(`/courses/${courseId}/modules`, data);
  return response.data;
};

export const createLesson = async (
  moduleId: string,
  data: { title: string; order: number; videoUrl: string }
) => {
  const response = await apiClient.post(`/modules/${moduleId}/lessons`, data);
  return response.data;
};

export const getCourses = async (): Promise<Course[]> => {
  const response = await apiClient.get("/courses");
  return response.data;
};

export const getCourseDetails = async (courseId: string): Promise<CourseDetails | null> => {
  console.log(`API REAL: Buscando detalhes para o curso ${courseId}...`);
  try {
    const response = await apiClient.get(`/courses/${courseId}`);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do curso:", error);
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  console.log("API REAL: Buscando usuário logado (/me)...");
    const response = await apiClient.get('/users/me'); 
  return response.data;
};

export async function updateUser(userId: string, data: { name?: string; phone?: string; file?: File }) {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.phone) formData.append("phone", data.phone);
  if (data.file) formData.append("file", data.file);

  const response = await apiClient.put(`/users/${userId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export const loginUser = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post('/users/login', credentials);

  console.log(response.data)
  return response.data;
};

export const createEnrollment = async (courseId: string, userId: string) => {
  const response = await apiClient.post(`/enrollment/courses/${courseId}/enrollments`, {
    userId,
  });
  return response.data;
};

export const getUserEnrollments = async (userId: string) => {
  const response = await apiClient.get(`/enrollment/users/${userId}/enrollments`);
  return response.data;
};

export const updateLessonProgress = async (
  lessonId: string,
  userId: string,
  progress: number,
  completed: boolean
) => {
  const response = await apiClient.post(`/progress/lessons/${lessonId}/progress`, {
    userId,
    progress,
    completed,
  });
  return response.data;
};

export async function getLessonProgress(userId: string) {
  const res = await apiClient.get(`/progress/users/${userId}/progress`);
  if (!res.statusText) throw new Error("Erro ao buscar progresso das lições");
  return await res.data();
}

export async function getModuleProgress(moduleId: string, userId: string) {
  const res = await apiClient.get(`/progress/modules/${moduleId}/users/${userId}`);
  if (!res.statusText) throw new Error("Erro ao buscar progresso do módulo");
  return await res.data();
}

export async function getCourseProgress(courseId: string, userId: string) {
  const res = await apiClient.get(`/progress/courses/${courseId}/users/${userId}`);
  if (!res.statusText) throw new Error("Erro ao buscar progresso do curso");
  return await res.data();
}