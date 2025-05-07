import NavbarRoutes from '@/components/navbar-routes';
import MobileSidebar from './mobile-sidebar';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';
const Navbar = async () => {
  const { userId } = await auth();
  const isAccessTeacher = isTeacher(userId);
  return (
    <div className="p-4 border-b h-full flex items-center justify-between bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes isAccessTeacher={isAccessTeacher} />
    </div>
  );
};

export default Navbar;
