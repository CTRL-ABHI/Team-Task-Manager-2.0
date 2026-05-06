import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Menu, Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 md:ml-64">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 md:hidden text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors mr-2"
          >
            <Menu size={20} />
          </button>
          <div className="hidden md:block">
            <h2 className="text-lg font-semibold text-slate-800">Welcome, {user?.name?.split(' ')[0]}</h2>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                ></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-soft-xl border border-slate-100 z-50 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                    <span className="text-xs font-semibold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    <div className="p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                      <p className="text-sm text-slate-800 font-medium">Welcome to Team Task Manager!</p>
                      <p className="text-xs text-slate-500 mt-1">Your premium workspace is ready. Start by creating a project.</p>
                      <span className="text-[10px] font-semibold text-slate-400 mt-2 block">Just now</span>
                    </div>
                  </div>
                  <div className="p-3 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          <Link to="/settings" className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 leading-none">{user?.name}</p>
              <p className="text-xs text-slate-500 mt-1 capitalize">{user?.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white group-hover:ring-sky-100 transition-all">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </Link>
          
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
