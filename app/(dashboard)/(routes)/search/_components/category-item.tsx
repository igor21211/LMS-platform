'use client';
import qs from 'query-string';
import { IconType } from 'react-icons/lib';
import { cn } from '@/lib/utils';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

interface CategoryItemProps {
  label: string;
  icon: IconType;
  value: string;
}

export const CategoryItem = ({
  label,
  icon: Icon,
  value,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');
  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };

  return (
    <button
      className={cn(
        'py-2 px-3 text-sm border border-slate-200 rounded-full flex intem-center gap-x-1 hover:border-sky-700 transition cursor-pointer',
        isSelected && 'border-sky-700 bg-sky-200/20 text-sky-700'
      )}
      onClick={onClick}
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};
