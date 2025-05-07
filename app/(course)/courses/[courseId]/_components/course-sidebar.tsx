import {
  Course,
  Chapter,
  UserProgress,
} from '@/lib/generated/prisma';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { CourseSidebarItem } from './course-sidebar-item';
import { CourseProgress } from '@/components/course-progress';
interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId as string,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10 flex items-center gap-x-2 text-slate-500 text-sm">
            <CourseProgress
              variant={progressCount === 100 ? 'success' : 'default'}
              value={progressCount}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isLocked={!chapter.isFree && !purchase}
            courseId={course.id}
          />
        ))}
      </div>
    </div>
  );
};
