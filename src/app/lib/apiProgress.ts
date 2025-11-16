const API_URL = "http://localhost:5000";

export async function updateLessonProgress(data: {
  lessonId: string;
  moduleId: string;
  courseId: string;
  userId: string;
  progress: number;
  completed: boolean;
}) {
  try {
    const res = await fetch(`${API_URL}/progress/lessons/${data.lessonId}/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Erro ao atualizar progresso: ${error}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ updateLessonProgress:", error);
    throw error;
  }
}

export async function getModuleProgress(moduleId: string, userId: string) {
  try {
    const res = await fetch(`${API_URL}/progress/modules/${moduleId}/users/${userId}`);
    if (!res.ok) throw new Error("Erro ao buscar progresso do módulo");
    const data = await res.json();

    return data.percentage ?? 0;
  } catch (error) {
    console.error("❌ getModuleProgress:", error);
    return 0;
  }
}

export async function getCourseProgress(courseId: string, userId: string) {
  try {
    const res = await fetch(`${API_URL}/progress/courses/${courseId}/users/${userId}`);
    if (!res.ok) throw new Error("Erro ao buscar progresso do curso");
    const data = await res.json();

    return data.percentage ?? 0;
  } catch (error) {
    console.error("❌ getCourseProgress:", error);
    return 0;
  }
}

export async function getLessonProgress(userId: string) {
  try {
    const res = await fetch(`${API_URL}/progress/users/${userId}/progress`);
    if (!res.ok) throw new Error("Erro ao buscar progresso das lições");
    return await res.json();
  } catch (error) {
    console.error("❌ getLessonProgress:", error);
    return [];
  }
}