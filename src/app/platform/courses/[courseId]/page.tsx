import LessonPlayer from "@/app/components/LessonPlayer";
import { getCourseDetails } from "@/app/lib/api";
import { ChevronDown, Download, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";

export default async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await getCourseDetails(params.courseId);

  if (!course) {
    notFound();
  }

  const defaultLesson = course.modules[0]?.lessons[0];

  return (
    <div className="flex flex-col lg:flex-row h-auto gap-8">
      {/* Course Content */}
      <div className="flex-1 bg-background dark:bg-dark-secondary p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
          {defaultLesson?.title || "Selecione uma aula"}
        </h1>

        {/* Lesson Player */}
        {defaultLesson && (
          <LessonPlayer
            type={defaultLesson.type as "video" | "text"}
            url={defaultLesson.videoUrl}
            content={defaultLesson.content}
            title={defaultLesson.title}
          />
        )}

        {/* Downloads */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Arquivos gerais do curso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-225">
            <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
              <span className="font-medium">Slides(PDF)</span>
              <Download className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md dark:border-gray-700">
              <span className="font-medium">Materiais complementares (PDF)</span>
              <Download className="h-5 w-5 text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Sidebar */}
      <aside className="w-full lg:w-100 bg-background dark:bg-dark-secondary rounded-lg">
        <h2 className="font-bold mb-4">{course.title}</h2>
        <div className="space-y-3">
          {course.modules.map((module) => (
            <div key={module.id}>
              <h3 className="font-semibold flex items-center justify-between cursor-pointer p-2 rounded hover:bg-secondary dark:hover:bg-dark-background">
                {module.title}
                <ChevronDown className="h-5 w-5" />
              </h3>
              <ul className="pl-4 mt-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-2 text-sm p-2 rounded cursor-pointer hover:bg-secondary dark:hover:bg-dark-background text-gray-600 dark:text-gray-300"
                  >
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span>{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
