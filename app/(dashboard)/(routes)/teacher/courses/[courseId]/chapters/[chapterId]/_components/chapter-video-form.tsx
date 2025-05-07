'use client';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle, VideoIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Chapter, MuxData } from '@/lib/generated/prisma/client';
import { FileUpload } from '@/components/file-upload';
import MuxPlayer from '@mux/mux-player-react';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: { videoUrl: string }) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapter updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log('[CHAPTER_ID_PAGE]', error);
      toast.error('Something went wrong');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={toggleEdit}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              playbackId={initialData.muxData?.playbackId}
            />
          </div>
        ))}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="  ">
          Videos can take up to 5 minutes to process. Please be
          patient. Refresh the page if the video is not available.
        </div>
      )}
    </div>
  );
};
