import Logo from './logo';
import SidebarRoutes from './sidebar-routes';

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-background shadow-sm">
      <div className="p-6">
        <Logo />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 py-4">
          <SidebarRoutes />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
