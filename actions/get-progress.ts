import db from '@/lib/db';
export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
        userProgress: {
          where: {
            userId: userId,
            isCompleted: true,
          },
          select: { id: true },
        },
      },
    });

    const totalChapters = publishedChaptersInCourse.length;
    const completedChapters = publishedChaptersInCourse.filter(
      (chapter) => chapter.userProgress.length > 0
    ).length;

    const progressPercentage =
      totalChapters === 0
        ? 0
        : (completedChapters / totalChapters) * 100;

    return progressPercentage;
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }
};
