"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, getCourses, getUserEnrollments, createEnrollment } from "@/app/lib/api";

type Filter = "all" | "not_started" | "in_progress" | "completed";

export default function CoursesHomePage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const router = useRouter();

  // Calcula o progresso de um curso com base nas lições.
  const calculateCourseProgress = (course: any): number => {
    const modules = course?.modules ?? [];
    const lessons = modules.flatMap((m: any) => m.lessons ?? []);
    const allLessonProgress = lessons.flatMap((l: any) => l.lessonProgresses ?? []);

    if (lessons.length === 0) return 0;

    const totalProgress = allLessonProgress.reduce(
      (sum: any, p: any) => sum + (p.progress ?? 0),
      0
    );

    const averageProgress = totalProgress / lessons.length;
    return Math.min(Math.round(averageProgress), 100);
  };


   // Carrega cursos e matrículas do usuário.
  const loadCoursesAndEnrollments = async () => {
    try {
      const user = await getMe();

      const [courses, enrollmentsData] = await Promise.all([
        getCourses(),
        getUserEnrollments(user.id),
      ]);

      const enrichedEnrollments = enrollmentsData.map((enrollment: any) => ({
        ...enrollment,
        course: {
          ...enrollment.course,
          progress: calculateCourseProgress(enrollment.course),
        },
      }));

      const enrolledCourseIds = enrichedEnrollments.map((e: any) => e.course.id);
      const notEnrolled = courses.filter(
        (c: any) => !enrolledCourseIds.includes(c.id)
      );

      setEnrollments(enrichedEnrollments);
      setAvailableCourses(notEnrolled);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscrição em um novo curso
   */
  const handleEnroll = async (courseId: string) => {
    try {
      const user = await getMe();
      await createEnrollment(courseId, user.id);
      await loadCoursesAndEnrollments();
    } catch (error) {
      console.error("Erro ao inscrever-se:", error);
    }
  };

  useEffect(() => {
    loadCoursesAndEnrollments();
  }, []);

  /**
   * Aplicação de busca e filtro
   */
  const filteredEnrollments = enrollments
    .filter((e) =>
      e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((e) => {
      const progress = e.course.progress ?? 0;
      switch (filter) {
        case "not_started": return progress === 0;
        case "in_progress": return progress > 0 && progress < 100;
        case "completed": return progress === 100;
        default: return true;
      }
    });

  const filteredAvailableCourses = availableCourses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Carregando cursos...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Meus Cursos</h1>

      {/* Busca e filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md px-4 py-2 w-full sm:w-80 focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Todos" },
            { key: "not_started", label: "Não iniciados" },
            { key: "in_progress", label: "Em andamento" },
            { key: "completed", label: "Concluídos" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as Filter)}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Cursos matriculados */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Cursos matriculados</h2>
        {filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const course = enrollment.course;
              const progress = course.progress ?? 0;

              let statusLabel = "Não iniciado";
              let buttonLabel = "Iniciar Curso";
              let buttonColor = "bg-blue-600 hover:bg-blue-700";

              if (progress === 0) {
                statusLabel = "Não iniciado";
                buttonLabel = "Iniciar Curso";
              } else if (progress > 0 && progress < 100) {
                statusLabel = "Em andamento";
                buttonLabel = "Continuar";
              } else {
                statusLabel = "Concluído";
                buttonLabel = "Ver Curso";
                buttonColor = "bg-green-600 hover:bg-green-700";
              }

              return (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Barra de progresso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    Progresso: {progress}%
                  </p>

                  <div className="flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        progress === 100
                          ? "bg-green-100 text-green-700"
                          : progress > 0
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {statusLabel}
                    </span>

                    <button
                      onClick={() => router.push(`/platform/courses/${course.id}`)}
                      className={`${buttonColor} text-white text-sm px-4 py-2 rounded transition-colors duration-200`}
                    >
                      {buttonLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Nenhum curso matriculado.</div>
        )}
      </div>

      {/* Cursos disponíveis */}
      <div>
        <h2 className="text-xl font-semibold mt-10 mb-4">Cursos disponíveis</h2>
        {filteredAvailableCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailableCourses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <button
                  onClick={() => handleEnroll(course.id)}
                  className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded transition-colors duration-200 w-full"
                >
                  Inscrever-se
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">Nenhum curso disponível.</div>
        )}
      </div>
    </div>
  );
}
