
import { getCourseDetails } from "@/app/lib/api";
import { notFound } from "next/navigation";
import CoursePageClient from "./CoursePageClient.";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params; 
  const course = await getCourseDetails(courseId);

  if (!course) {
    notFound();
  }
    return (
    <div>
        <CoursePageClient course={course} />
    </div>
  );
}
