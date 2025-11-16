import { useState, useEffect, useCallback, useRef } from "react";
import {
  updateLessonProgress,
  getModuleProgress,
  getCourseProgress,
  getLessonProgress,
} from "@/app/lib/apiProgress";

interface LessonProgress {
  lessonId: string;
  progress?: number;
  completed?: boolean;
}

export function useLessonProgress(
  lessonId: string,
  userId: string,
  moduleId: string,
  courseId: string
) {
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const lastSentProgress = useRef(0);

  const fetchProgress = useCallback(async () => {
    if (!lessonId || !userId) return;
    try {
      setLoading(true);

      const data: LessonProgress[] = await getLessonProgress(userId);

      const lessonProgress = data.find((p) => p.lessonId === lessonId);

      if (lessonProgress) {
        setProgress(lessonProgress.progress ?? 0);
        setCompleted(lessonProgress.completed ?? false);
        lastSentProgress.current = lessonProgress.progress ?? 0;
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setLoading(false);
    }
  }, [lessonId, userId]);

  const updateProgress = useCallback(
    async (newProgress: number, isCompleted = false) => {
      if (!lessonId || !userId) return;

      const rounded = Math.floor(newProgress);
      // Evita envios desnecessários para a API
      if (Math.abs(rounded - lastSentProgress.current) < 2 && !isCompleted) return;

      lastSentProgress.current = rounded;
      setProgress(rounded);
      if (isCompleted) setCompleted(true);

      try {
        await updateLessonProgress({
          lessonId,
          moduleId,
          courseId,
          userId,
          progress: rounded,
          completed: isCompleted,
        });

        const [moduleProg, courseProg] = await Promise.all([
          getModuleProgress(moduleId, userId),
          getCourseProgress(courseId, userId),
        ]);

        window.dispatchEvent(
          new CustomEvent("moduleProgressUpdated", { detail: { moduleId, moduleProg } })
        );
        window.dispatchEvent(
          new CustomEvent("courseProgressUpdated", { detail: { courseId, courseProg } })
        );
        window.dispatchEvent(new Event("lessonProgressUpdated"));
        
      } catch (err) {
        console.error("Erro ao atualizar progresso:", err);
      }
    },
    [lessonId, moduleId, courseId, userId]
  );

  const markAsCompleted = useCallback(() => {
    updateProgress(100, true);
  }, [updateProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { progress, completed, loading, updateProgress, markAsCompleted };
}