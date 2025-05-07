import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    const { list } = await req.json();

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

    for (const chapter of list) {
      await db.chapter.update({
        where: { id: chapter.id },
        data: { position: chapter.position },
      });
    }

    return NextResponse.json(
      { message: 'Chapters reordered' },
      { status: 200 }
    );
  } catch (error) {
    console.log('[COURSE_ID_PAGE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
