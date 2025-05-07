'use client';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useConfettiStore from '@/hooks/use-confetti-store';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId: string;
  isCompleted: boolean;
}

export const CourseProgressButton = ({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isCompleted ? XCircle : CheckCircle;
  const handleClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/courses/${courseId}/chapters/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );
      if (!isCompleted) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
      toast.success('Progress updated');
      router.refresh();
    } catch (error) {
      console.log('[COURSE_PROGRESS_BUTTON_ERROR]', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      type="button"
      className="w-full md:w-auto"
      size="sm"
      variant={isCompleted ? 'outline' : 'success'}
    >
      {isCompleted ? 'Not completed' : 'Mark as complete'}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};
