import CourseCard from "@/app/components/course/CourseCard";
import { getCourses } from "@/app/lib/api";

const CourseSection = ({ title, courses }: { title: string, courses: Awaited<ReturnType<typeof getCourses>> }) => {
    if (courses.length === 0) {
        return null; 
    }

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </section>
    );
};


export default async function CoursesPage() {
    const courses = await getCourses();

    const inProgressCourses = courses.filter(c => c.progress > 0 && c.progress < 100);
    const notStartedCourses = courses.filter(c => c.progress === 0);
    const completedCourses = courses.filter(c => c.progress === 100);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Meus Cursos</h1>
            
            <CourseSection title="Em andamento" courses={inProgressCourses} />
            <CourseSection title="Não iniciados" courses={notStartedCourses} />
            <CourseSection title="Concluídos" courses={completedCourses} />
            
            {courses.length === 0 && (
                 <div className="text-center py-10">
                    <p className="text-gray-500">Você ainda não está inscrito em nenhum curso.</p>
                </div>
            )}
        </div>
    );
}