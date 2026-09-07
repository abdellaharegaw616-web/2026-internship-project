import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Settings, LogOut, ChevronRight, Zap, Moon, Sun, X
} from 'lucide-react';
import LogoMark from '../LogoMark';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import Avatar from '../common/Avatar';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/users', icon: Users, label: 'Team' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900/60 flex flex-col sticky top-0 left-0 flex-shrink-0 overflow-hidden transition-colors duration-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-6 h-[60px] border-b border-slate-100 dark:border-slate-900/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <LogoMark size={32} className="shrink-0" />
          <div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white font-heading leading-tight tracking-tight">Task Flow</h1>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Project Management</p>
          </div>
        </div>
        <button 
          onClick={() => document.dispatchEvent(new CustomEvent('close-sidebar'))}
          className="lg:hidden p-1.5 -mr-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto min-h-0 space-y-1">
        {navItems.filter(item => {
          if (item.label === 'Team' && user?.role === 'TeamMember') return false;
          return true;
        }).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => document.dispatchEvent(new CustomEvent('close-sidebar'))}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group
              ${isActive 
                ? 'bg-blue-50/80 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-semibold' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={`transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'}`} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-blue-500 dark:text-blue-400 animate-pulse" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-900/60 bg-slate-50/40 dark:bg-slate-950/40 flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl border border-slate-100/50 dark:border-slate-900/40 bg-white dark:bg-slate-900/60 shadow-sm shadow-slate-100/10">
          <Avatar user={user} className="w-8 h-8 ring-2 ring-slate-100 dark:ring-slate-800 text-xs" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">{user?.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate mt-1">{user?.role === 'ProjectManager' ? 'Project Manager' : user?.role}</p>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-slate-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-colors"
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
