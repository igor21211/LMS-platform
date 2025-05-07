import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { isTeacher } from '@/lib/teacher';
const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const isAccessTeacher = isTeacher(userId);
    const { courseId } = await params;
    if (!userId || !isAccessTeacher) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }
    const deletedCourse = await db.course.delete({
      where: { id: courseId },
    });
    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log('[COURSE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    const isAccessTeacher = isTeacher(userId);
    if (!userId || !isAccessTeacher) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId } = await params;
    const values = await req.json();
    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values,
      },
    });
    if (!course) {
      return new NextResponse('Not found', { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSE_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
