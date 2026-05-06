import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings, Users } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={20} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
    { name: 'Team Directory', path: '/team', icon: <Users size={20} /> },
  ];

  return (
    <aside className="w-64 fixed hidden md:flex flex-col h-screen top-0 left-0 z-20 bg-white border-r border-slate-200">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center shadow-sm">
              <CheckSquare className="text-white" size={18} strokeWidth={2.5} />
            </div>
            TaskFlow
          </h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className="block relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-sky-50 rounded-lg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium z-10 text-sm ${
                  isActive
                    ? 'text-sky-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}>
                  <span className={`${isActive ? 'text-sky-600' : 'text-slate-400'}`}>
                    {link.icon}
                  </span>
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <Link 
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-slate-500 transition-colors font-medium text-sm hover:text-slate-900 hover:bg-slate-50"
          >
            <Settings size={20} className="text-slate-400" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
