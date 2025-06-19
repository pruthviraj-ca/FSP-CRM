
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, Home, Users, BarChart3, Calendar, FileUp, 
  LogOut, UserCircle, Presentation, CheckSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isManager = user?.role === 'manager';

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Leads',
      path: '/leads',
      icon: <Users className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Properties',
      path: '/properties',
      icon: <Building2 className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Upload Data',
      path: '/upload',
      icon: <FileUp className="mr-2 h-5 w-5" />,
      show: isManager,
    },
    {
      name: 'Distribute',
      path: '/distribute',
      icon: <Presentation className="mr-2 h-5 w-5" />,
      show: isManager,
    },
    {
      name: 'Team',
      path: '/team',
      icon: <Users className="mr-2 h-5 w-5" />,
      show: isManager,
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart3 className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: <Calendar className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Settlements',
      path: '/settlements',
      icon: <CheckSquare className="mr-2 h-5 w-5" />,
      show: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <UserCircle className="mr-2 h-5 w-5" />,
      show: true,
    },
  ];

  return (
    <div className="bg-sidebar w-64 h-screen flex flex-col border-r">
      <div className="p-6 border-b flex items-center">
        <Building2 className="h-6 w-6 text-realestate-primary mr-2" />
        <h1 className="text-xl font-bold">Sales Navigator</h1>
      </div>
      
      <div className="px-4 py-4 border-b">
        <div className="flex items-center">
          <div className="bg-realestate-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.filter(item => item.show).map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
