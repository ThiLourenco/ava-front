export interface User {
  name: string;
  cpf: string;
  avatarUrl: string;
  email: string;
  phone?: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
}


export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text'; 
  isCompleted: boolean;
  videoUrl?: string; 
  content?: string; 
  resources?: Resource[]; 
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  matricula: string;
  title: string;
  description: string;
  progress: number;
}

export interface CourseDetails {
  id: string;
  matricula: string;
  title: string;
  description: string;
  modules: Module[];
}


export interface LessonContext {
  currentLesson: Lesson;
  courseTitle: string;
  previousLesson: { id: string; title: string } | null;
  nextLesson: { id: string; title: string } | null;
}


export interface DashboardData {
    user: User;
    courses: Course[];
    lastAccessedCourse: Course | null;
}