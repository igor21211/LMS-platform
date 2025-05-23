import db from '@/lib/db';
import { Course, Category } from '@/lib/generated/prisma/client';
import { getProgress } from './get-progress';
type CourseWithPurchases = Course & {
  purchases: { id: string }[];
  category: Category | null;
  chapters: { id: string }[];
};
type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};
type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};
export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses: CourseWithPurchases[] = await db.course.findMany({
      where: {
        isPublished: true,
        title: { contains: title },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: { where: { userId } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course: CourseWithPurchases) => {
          if (course.purchases.length === 0) {
            return {
              ...course,
              progress: null,
              category: course.category,
              chapters: course.chapters,
            };
          }
          const progressPercentage = await getProgress(
            userId,
            course.id
          );
          return {
            ...course,
            progress: progressPercentage,
            category: course.category,
            chapters: course.chapters,
          };
        })
      );
    return coursesWithProgress;
  } catch (error) {
    console.log('[GET_COURSES]', error);
    return [];
  }
};
