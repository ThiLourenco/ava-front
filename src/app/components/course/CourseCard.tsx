import { Course } from "@/app/lib/types";
import { PlusCircle, PlayCircle } from "lucide-react";
import Link from "next/link";

const CourseCard = ({ course }: { course: Course }) => {
  const isCompleted = course.progress === 100;
  const isNotStarted = course.progress === 0;

  const progressBarColor = isCompleted
    ? 'bg-green-500'
    : isNotStarted
    ? 'bg-gray-300'
    : 'bg-blue-500';

  
  const statusText = isCompleted
    ? `${course.progress}% Concluído`
    : isNotStarted
    ? 'Não iniciado'
    : `${course.progress}% em andamento`;

  return (
    <div className="bg-foreground p-4 rounded-lg shadow-md flex flex-col h-full">
      <p className="text-xs text-gray-500">Matrícula: {course.matricula}</p>
      <h4 className="font-bold my-2 flex-grow">{course.title}</h4>
      
      <div className="w-full bg-surface rounded-full h-1.5">
        <div className={`${progressBarColor} h-1.5 rounded-full`} style={{ width: `${isNotStarted ? 100 : course.progress}%` }}></div>
      </div>
      
      <p className="text-xs text-gray-500 mt-1">{statusText}</p>
      
      {/* LINHA CORRIGIDA ABAIXO */}
      <Link href={`/platform/courses/${course.id}`}>
        <button className="w-full mt-4 flex items-center justify-center gap-2 border border-primary text-primary dark:border-primary border-zinc-400 dark:text-dark-primary font-semibold py-2 rounded-lg text-sm hover:bg-primary/5 transition-colors">
          {isCompleted ? <PlusCircle size={16} /> : <PlayCircle size={16} />}
          {isNotStarted ? 'Iniciar Curso' : 'Acessar Curso'}
        </button>
      </Link>
    </div>
  );
};

export default CourseCard;
