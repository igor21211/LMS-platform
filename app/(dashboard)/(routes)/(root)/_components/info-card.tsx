import IconBadge from '@/components/icon-badge';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: 'default' | 'success';
}

export const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: InfoCardProps) => {
  return (
    <div className="p-3 border rounded-md flex items-center gap-x-2">
      <IconBadge icon={Icon} variant={variant} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  );
};
