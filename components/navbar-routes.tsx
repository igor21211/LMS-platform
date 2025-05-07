'use client';

import { usePathname } from 'next/navigation';

import { UserButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { SearchInput } from './search-input';
const NavbarRoutes = ({
  isAccessTeacher,
}: {
  isAccessTeacher: boolean;
}) => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isPlayerPage = pathname?.includes('/courses');
  const isSearchPage = pathname?.includes('/search');

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isAccessTeacher ? (
          <Link href="/teacher/courses">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer"
            >
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton afterSwitchSessionUrl="/sign-in" />
      </div>
    </>
  );
};

export default NavbarRoutes;
