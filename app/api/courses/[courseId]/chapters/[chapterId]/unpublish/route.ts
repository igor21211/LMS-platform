import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId, chapterId } = await params;
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });
    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });
    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.videoUrl ||
      !chapter.description
    ) {
      return new NextResponse('Missing required fields', {
        status: 400,
      });
    }
    const unpublishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: false },
    });
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });
    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: { id: courseId },
        data: { isPublished: false },
      });
    }

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    console.log('[CHAPTER_ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
