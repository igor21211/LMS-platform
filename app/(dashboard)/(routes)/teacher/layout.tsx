import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isTeacher } from '@/lib/teacher';
export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  const isAccessTeacher = isTeacher(userId);
  if (!isAccessTeacher) {
    return redirect('/');
  }
  return <>{children}</>;
}
