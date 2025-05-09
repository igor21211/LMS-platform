import { getChapter } from '@/actions/get-chapter';
import { Banner } from '@/components/banner';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { VideoPlayer } from './_components/video-player';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { Separator } from '@/components/ui/separator';
import { Preview } from '@/components/preview';
import { File, Download } from 'lucide-react';
import { CourseProgressButton } from './_components/course-progress-button';
const ChapterPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chaptersId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect('/');
  }
  const { courseId, chaptersId } = await params;
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId,
    chapterId: chaptersId,
  });

  if (!chapter || !course) {
    return redirect('/');
  }

  const isLocked = !chapter.isFree && !purchase;
  console.log(isLocked);
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch the chapter."
        />
      )}
      {completeOnEnd && (
        <Banner
          variant="success"
          label="You will complete this chapter on route."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chaptersId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between  ">
            <h2 className="text-2xl md:text-4xl font-bold">
              {chapter.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={chaptersId}
                courseId={courseId}
                nextChapterId={nextChapter?.id || ''}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    className="flex items-center p-3 w-full bg-slate-100 border text-sm hover:underline text-slate-700"
                  >
                    <File className="h-4 w-4 mr-2" />
                    <p>{attachment.name}</p>
                    <Download className="h-4 w-4 ml-2" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
