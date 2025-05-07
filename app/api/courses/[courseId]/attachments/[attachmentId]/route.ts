import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { courseId, attachmentId } = await params;
    if (!courseId || !attachmentId) {
      return new NextResponse('Missing courseId or attachmentId', {
        status: 400,
      });
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
    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
        courseId: courseId,
      },
    });
    return NextResponse.json(attachment);
  } catch (error) {
    console.log('[ATTACHMENT_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
