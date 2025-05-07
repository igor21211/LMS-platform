import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  {
    params,
  }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { isCompleted } = await req.json();
    const { courseId, chapterId } = await params;

    if (!courseId || !chapterId) {
      return new NextResponse('Missing courseId or chapterId', {
        status: 400,
      });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[CHAPTER_ID_PROGRESS_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
