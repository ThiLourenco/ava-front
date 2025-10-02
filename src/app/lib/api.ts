import { Course, CourseDetails, User, DashboardData, LessonContext } from "./types";

export const MOCK_USER: User = {
  name: "Thiago Lourenço",
  cpf: "120.XXX.XXX-10",
  avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  email: "thiago.lourenco@email.com",
  phone: "(11) 98765-4321", 
};

let ALL_COURSES_DETAILS: CourseDetails[] = [
  {
    id: '1',
    matricula: '2990958',
    title: 'Governança em TI',
    description: 'Fundamentos da governança de tecnologia da informação.',
    modules: [
      { id: 'm1-1', title: 'Bloco 01: Apresentação', lessons: [
          { id: 'l1-1-1', title: 'Introdução ao Curso', type: 'video', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/qJeDPgTEfp0' },
          { id: 'l1-1-2', title: 'Estrutura e Objetivos', type: 'video', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/aRFPKwJe2lE' },
        ]
      },
      { id: 'm1-2', title: 'Tema 01: Fundamentos', lessons: [
          { id: 'l1-2-1', title: 'O que é Governança?', type: 'video', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/D8UJ3BbRXBA' },
          { id: 'l1-2-2', title: 'Leitura Complementar', type: 'text', isCompleted: true, content: '<h1>Leitura sobre Governança</h1><p>Este é um texto em HTML sobre a importância da governança de TI nas organizações modernas...</p>', resources: [{id: 'r1', title: 'Artigo Completo.pdf', url: '#'}] },
        ]
      },
    ]
  },
  {
    id: '2',
    matricula: '2990958',
    title: 'Cloud Computing',
    description: 'Entenda os conceitos de computação em nuvem.',
    modules: [
      { id: 'm2-1', title: 'Módulo 1: Introdução à Nuvem', lessons: [
          { id: 'l2-1-1', title: 'O que é Cloud?', type: 'video', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/M-4_p_d0d48' },
          { id: 'l2-1-2', title: 'Modelos de Serviço', type: 'video', isCompleted: true, videoUrl: 'https://www.youtube.com/embed/0omja0_D-2Q' },
          { id: 'l2-1-3', title: 'Modelos de Implantação', type: 'text', isCompleted: false, content: '<h1>Nuvem Pública vs. Privada vs. Híbrida</h1><p>Explorando as diferenças...</p>' },
        ]
      },
      { id: 'm2-2', title: 'Módulo 2: Provedores', lessons: [
          { id: 'l2-2-1', title: 'Amazon Web Services (AWS)', type: 'video', isCompleted: false, videoUrl: 'https://www.youtube.com/embed/ulh_tJ18s24' },
          { id: 'l2-2-2', title: 'Microsoft Azure', type: 'video', isCompleted: false, videoUrl: 'https://www.youtube.com/embed/p2_p_RjIY64' },
        ]
      },
    ]
  },
];

const calculateProgress = (course: CourseDetails): number => {
  const allLessons = course.modules.flatMap(module => module.lessons);
  if (allLessons.length === 0) return 0;
  const completedLessons = allLessons.filter(lesson => lesson.isCompleted).length;
  return Math.round((completedLessons / allLessons.length) * 100);
};

export const getUser = async (): Promise<User> => {
  console.log("API MOCK: Fetching user...");
  return new Promise(resolve => setTimeout(() => resolve(MOCK_USER), 200));
}

export const getCourses = async (): Promise<Course[]> => {
  console.log("API MOCK: Fetching courses summary...");
  const summaryCourses: Course[] = ALL_COURSES_DETAILS.map(course => ({
    id: course.id,
    matricula: course.matricula,
    title: course.title,
    description: course.description,
    progress: calculateProgress(course),
  }));
  return new Promise(resolve => setTimeout(() => resolve(summaryCourses), 300));
};

export const getDashboardData = async (): Promise<DashboardData> => {
    console.log("API MOCK: Fetching all dashboard data...");
    const user = await getUser();
    const courses = await getCourses();
    const lastAccessedCourse = courses.find(c => c.progress > 0 && c.progress < 100) || courses[0] || null;

    return new Promise(resolve => setTimeout(() => resolve({ user, courses, lastAccessedCourse }), 400));
}

export const getCourseDetails = async (courseId: string): Promise<CourseDetails | null> => {
  console.log(`API MOCK: Fetching details for course ${courseId}...`);
  const course = ALL_COURSES_DETAILS.find(c => c.id === courseId);
  return new Promise(resolve => setTimeout(() => resolve(course || null), 300));
};

export const toggleLessonCompletion = async (courseId: string, lessonId: string): Promise<boolean> => {
    console.log(`API MOCK: Toggling lesson ${lessonId} in course ${courseId}`);
    let lessonFound = false;
    ALL_COURSES_DETAILS = ALL_COURSES_DETAILS.map(course => {
        if (course.id === courseId) {
            return { ...course, modules: course.modules.map(module => ({ ...module, lessons: module.lessons.map(lesson => {
                if (lesson.id === lessonId) {
                    lessonFound = true;
                    return { ...lesson, isCompleted: !lesson.isCompleted };
                }
                return lesson;
            })}))};
        }
        return course;
    });
    return new Promise(resolve => setTimeout(() => resolve(lessonFound), 100));
};


export const getLessonWithContext = async (courseId: string, lessonId: string): Promise<LessonContext | null> => {
    console.log(`API MOCK: Fetching lesson ${lessonId} with context from course ${courseId}...`);
    const course = await getCourseDetails(courseId);
    if (!course) return null;

    const allLessonsFlat = course.modules.flatMap(m => m.lessons);
    const currentLessonIndex = allLessonsFlat.findIndex(l => l.id === lessonId);

    if (currentLessonIndex === -1) return null;

    const currentLesson = allLessonsFlat[currentLessonIndex];
    const previousLesson = currentLessonIndex > 0 ? allLessonsFlat[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < allLessonsFlat.length - 1 ? allLessonsFlat[currentLessonIndex + 1] : null;

    const context: LessonContext = {
        courseTitle: course.title,
        currentLesson,
        previousLesson: previousLesson ? { id: previousLesson.id, title: previousLesson.title } : null,
        nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
    };

    return new Promise(resolve => setTimeout(() => resolve(context), 250));
};
