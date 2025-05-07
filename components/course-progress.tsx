import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
interface CourseProgressProps {
  variant?: 'default' | 'success';
  value: number;
  size?: 'default' | 'sm';
}

const colorByVariant = {
  default: 'text-sky-700',
  success: 'text-emerald-700',
};

const sizeByVariant = {
  default: 'text-sm',
  sm: 'text-xs',
};
export const CourseProgress = ({
  variant = 'default',
  value,
  size = 'default',
}: CourseProgressProps) => {
  return (
    <div className="w-full">
      <Progress value={value} className="h-2" variant={variant} />
      <p
        className={cn(
          'font-medium mt-2 text-sky-700',
          colorByVariant[variant],
          sizeByVariant[size]
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
