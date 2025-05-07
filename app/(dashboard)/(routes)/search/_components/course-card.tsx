import Image from 'next/image';
import Link from 'next/link';

import {
  BookOpen,
  CircleDollarSign,
} from 'lucide-react';
import IconBadge from '@/components/icon-badge';
import { formatPrice } from '@/lib/format';
import { CourseProgress } from '@/components/course-progress';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  category: string;
  progress: number | null;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
  progress,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium text-slate-700">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-slate-500 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength}{' '}
                {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? 'success' : 'default'}
              value={progress}
            />
          ) : (
            <div className="mt-auto flex items-center gap-x-2 text-slate-700 text-sm md:text-xs">
              <IconBadge size="sm" icon={CircleDollarSign} />
              {formatPrice(price)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
