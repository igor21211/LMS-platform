import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = await params;
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse('Course not found', { status: 404 });
    }
    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (!hasPublishedChapters) {
      return new NextResponse('You must have at least one published chapter', {
        status: 400,
      });
    }
    if(!course.title || !course.description || !course.imageUrl || !hasPublishedChapters ||!course.categoryId) {
        return new NextResponse('Missing required fields', { status: 400 });
    }
    const publishedCourse = await db.course.update({
      where: { id: courseId, userId },
      data: { isPublished: true },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log('[COURSE_ID_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
