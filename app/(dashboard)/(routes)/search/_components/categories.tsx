'use client';

import { Category } from '@/lib/generated/prisma/client';
import {
  FcCommandLine,
  FcFlashOn,
  FcProcess,
  FcSettings,
  FcGlobe,
  FcTreeStructure,
  FcRefresh,
  FcLinux,
  FcDataProtection,
  FcPlus,
  FcLike,
  FcBusinessman,
  FcDatabase,
} from 'react-icons/fc';
import { IconType } from 'react-icons/lib';
import { CategoryItem } from './category-item';

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<string, IconType> = {
  Java: FcCommandLine,
  JavaScript: FcFlashOn,
  Python: FcProcess,
  TypeScript: FcSettings,
  'Next.js': FcGlobe,
  'Spring Framework': FcTreeStructure,
  React: FcRefresh,
  'Node.js': FcLinux,
  'C#': FcDataProtection,
  'C++': FcPlus,
  Ruby: FcLike,
  PHP: FcBusinessman,
  SQL: FcDatabase,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
