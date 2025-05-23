import { Category, Course } from '@/lib/generated/prisma/client';
import { CourseCard } from './course-card';
type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {items.map((item) => (
        <CourseCard
          key={item.id}
          id={item.id}
          title={item.title}
          imageUrl={item.imageUrl!}
          chaptersLength={item.chapters.length}
          price={item.price!}
          category={item?.category?.name || ''}
          progress={item.progress}
        />
      ))}
      {items.length === 0 && (
        <div className="mt-10 text-center text-sm text-muted-foreground m-10">
          No courses found
        </div>
      )}
    </div>
  );
};
