import { isTeacher } from '@/lib/teacher';
import { auth } from '@clerk/nextjs/server';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();
const handleAuth = async () => {
  const { userId } = await auth();
  const isAccessTeacher = isTeacher(userId);
  if (!userId || !isAccessTeacher)
    throw new UploadThingError('Unauthorized');
  return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseVideo: f({ video: { maxFileSize: '512MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
