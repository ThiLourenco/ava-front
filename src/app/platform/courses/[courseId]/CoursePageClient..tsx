"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LessonPlayer from "@/app/components/LessonPlayer"; 
import { ChevronDown, Download, PlayCircle, CheckCircle } from "lucide-react";
import {
  getCourseProgress,
  getModuleProgress,
  getLessonProgress,
} from "../../../lib/apiProgress"; 
import { getMe } from "@/app/lib/api";

interface CoursePageClientProps {
  course: any;
}

export default function CoursePageClient({ course }: CoursePageClientProps) {
  const defaultLesson = course.modules?.[0]?.lessons?.[0] || null;
  const [selectedLesson, setSelectedLesson] = useState(defaultLesson);
  const [openModule, setOpenModule] = useState<string | null>(course.modules?.[0]?.id || null);

  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [moduleProgresses, setModuleProgresses] = useState<Record<string, number>>({});
  const [lessonProgresses, setLessonProgresses] = useState<Record<string, { progress: number; completed: boolean }>>({});
  const [userId, setUserId] = useState<string>("");

  const toggleModule = (id: string) => {
    setOpenModule(openModule === id ? null : id);
  };

  // Atualiza progresso do curso, módulos e lições
  const loadProgress = useCallback(async () => {
    try {
      const user = await getMe();
      if (!user?.id) return;
      setUserId(user.id);

      // Progresso geral do curso
      const newCourseProgress = await getCourseProgress(course.id, user.id);
      setCourseProgress(newCourseProgress);
      // console.log("[Course Progress API]:", newCourseProgress);


      // Progresso de cada módulo
      const moduleResults = await Promise.all(
        course.modules.map((m: any) => getModuleProgress(m.id, user.id))
      );

      const progressMap: Record<string, number> = {};
      moduleResults.forEach((res, idx) => {
        progressMap[course.modules[idx].id] = res ?? 0;
      });

      // console.log("[Module Progress API]:", progressMap);
      setModuleProgresses(progressMap);


      // Progresso das lições
      const lessonsData = await getLessonProgress(user.id);
      const lessonsMap: Record<string, { progress: number; completed: boolean }> = {};
      lessonsData.forEach((l: any) => {
        // `l` é o objeto LessonProgress completo
        lessonsMap[l.lessonId] = {
          progress: l.progress ?? 0,
          completed: l.completed ?? false,
        };
      });
      setLessonProgresses(lessonsMap);
      // console.log("[Lesson Progress API]:", lessonsMap);

    } catch (error) {
      console.error("❌ Erro ao carregar progresso:", error);
    }
  }, [course.id, course.modules]);

  useEffect(() => {
    loadProgress();

    const handleProgressUpdate = () => {
      console.log("🔄 Evento de atualização recebido, recarregando progresso...");
      loadProgress();
    };

    window.addEventListener("lessonProgressUpdated", handleProgressUpdate);
    window.addEventListener("moduleProgressUpdated", handleProgressUpdate);
    window.addEventListener("courseProgressUpdated", handleProgressUpdate);

    return () => {
      window.removeEventListener("lessonProgressUpdated", handleProgressUpdate);
      window.removeEventListener("moduleProgressUpdated", handleProgressUpdate);
      window.removeEventListener("courseProgressUpdated", handleProgressUpdate);
    };
  }, [loadProgress]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 bg-background dark:bg-dark-secondary p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          {selectedLesson?.title || "Selecione uma aula"}
        </h1>

        {selectedLesson ? (
          <LessonPlayer
            type="video"
            url={selectedLesson.videoUrl}
            content={selectedLesson.content}
            title={selectedLesson.title}
            lessonId={selectedLesson.id}
            moduleId={selectedLesson.moduleId}
            courseId={course.id}
            key={selectedLesson.id}
          />
        ) : (
          <p className="text-gray-500 text-sm">
            Selecione uma aula no painel lateral para começar.
          </p>
        )}

        {/* DOWNLOADS */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Arquivos do curso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
              <span className="font-medium">Slides (PDF)</span>
              <Download className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
              <span className="font-medium">Materiais complementares (PDF)</span>
              <Download className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-full lg:w-96 bg-background dark:bg-dark-secondary rounded-lg p-4">
        <h2 className="font-bold mb-4">{course.title}</h2>

        {/* PROGRESSO GERAL */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            Progresso do curso: {courseProgress.toFixed(0)}%
          </p>
        </div>

        {/* MÓDULOS E AULAS */}
        <div className="space-y-3">
          {course.modules.map((module: any) => {
            const isOpen = openModule === module.id;
            const progress = moduleProgresses[module.id] ?? 0;

            return (
              <div key={module.id} className="border-b dark:border-gray-700 pb-2">
                <h3
                  onClick={() => toggleModule(module.id)}
                  className="font-semibold flex items-center justify-between cursor-pointer p-2 rounded hover:bg-secondary dark:hover:bg-dark-background"
                >
                  <span>{module.title}</span>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500">{progress.toFixed(0)}%</p>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-5 w-5" />
                    </motion.div>
                  </div>
                </h3>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="pl-4 mt-2 space-y-1 overflow-hidden"
                    >
                      {module.lessons.map((lesson: any) => {
                        const lessonData = lessonProgresses[lesson.id];
                        const lessonProgress = lessonData?.progress ?? 0;
                        const completed = lessonData?.completed ?? false;

                        return (
                          <li
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`flex items-center justify-between text-sm p-2 rounded cursor-pointer hover:bg-secondary dark:hover:bg-dark-background ${
                              selectedLesson?.id === lesson.id
                                ? "bg-secondary dark:bg-dark-background"
                                : "text-gray-600 dark:text-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              )}
                              <span>{lesson.title}</span>
                            </div>

                            {completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="text-xs text-gray-400">{lessonProgress}%</span>
                            )}
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}