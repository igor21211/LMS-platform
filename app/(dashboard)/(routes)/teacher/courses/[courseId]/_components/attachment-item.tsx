'use client';
import { Attachment } from '@/lib/generated/prisma/client';
import axios from 'axios';
import { File, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
interface AttachmentItemProps {
  attachment: Attachment;
  courseId: string;
}

export const AttachmentItem = ({
  attachment,
  courseId,
}: AttachmentItemProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );
      toast.success('Attachment deleted');
      router.refresh();
    } catch (error) {
      console.log('[COURSE_ID_ATTACHMENT_ITEM]', error);
      toast.error('Failed to delete attachment');
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <div
      className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border
     text-sky-700 rounded-md hover:bg-sky-200/50 hover:text-sky-700 transition cursor-pointer"
    >
      <File className="h-4 w-4 mr-2 flex-shrink-0" />
      <p className="text-xs line-clamp-1">{attachment.name}</p>
      {deletingId === attachment.id && (
        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
      )}
      {deletingId !== attachment.id && (
        <button
          className="ml-auto hover:opacity-75 transition"
          onClick={() => onDelete(attachment.id)}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
