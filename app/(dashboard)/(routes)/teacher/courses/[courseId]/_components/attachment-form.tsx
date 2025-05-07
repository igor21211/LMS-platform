'use client';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Attachment, Course } from '@/lib/generated/prisma/client';
import { FileUpload } from '@/components/file-upload';
import { z } from 'zod';
import { AttachmentItem } from './attachment-item';

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  url: z.string().min(1),
});
export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success('Course updated');
      toggleEdit();
      router.refresh();
    } catch (error) {
      console.log('[COURSE_ID_PAGE]', error);
      toast.error('Something went wrong');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={toggleEdit}
        >
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="flex flex-col gap-y-2">
              {initialData.attachments.map((attachment) => (
                <AttachmentItem
                  key={attachment.id}
                  attachment={attachment}
                  courseId={courseId}
                />
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div className="mt-4">
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground">
            Add anything your students need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
