import db from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const isAccessTeacher = isTeacher(userId);
    if (!userId || !isAccessTeacher) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { title } = await req.json();
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
