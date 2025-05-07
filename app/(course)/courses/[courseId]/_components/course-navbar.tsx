import NavbarRoutes from '@/components/navbar-routes';
import {
  Chapter,
  Course,
  UserProgress,
} from '@/lib/generated/prisma';
import { CourseMobileSidebar } from './course-mobile-sidebar';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';
interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = async ({
  course,
  progressCount,
}: CourseNavbarProps) => {
  const { userId } = await auth();
  const isAccessTeacher = isTeacher(userId);
  return (
    <div className="p-4 border-b h-full w-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar
        course={course}
        progressCount={progressCount}
      />
      <NavbarRoutes isAccessTeacher={isAccessTeacher} />
    </div>
  );
};
