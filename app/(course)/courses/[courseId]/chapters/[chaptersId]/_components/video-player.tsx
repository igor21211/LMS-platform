'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import MuxPlayer from '@mux/mux-player-react';
import useConfettiStore from '@/hooks/use-confetti-store';
import axios from 'axios';

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId: string | undefined;
  playbackId: string | undefined;
  isLocked: boolean;
  completeOnEnd: boolean;
}

export const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isReady, setIsReady] = useState(false);
  console.log(playbackId);

  const onEnded = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
        if (!nextChapterId) {
          toast.success('You have completed the chapter.');
          confetti.onOpen();
          router.push(`/courses/${courseId}`);
        }
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error) {
      console.log('[VIDEO_PLAYER_ERROR]', error);
    }
  };

  const onReady = () => {
    setIsReady(true);
  };

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary" />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-4 text-secondary">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked.</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          className={cn(!isReady && 'hidden')}
          title={title}
          playbackId={playbackId}
          onCanPlay={onReady}
          onEnded={onEnded}
          autoPlay
        />
      )}
    </div>
  );
};
