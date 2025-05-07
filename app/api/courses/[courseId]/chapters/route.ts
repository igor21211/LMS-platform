import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        position: newPosition,
        courseId: courseId,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log('[COURSES_CHAPTERS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
