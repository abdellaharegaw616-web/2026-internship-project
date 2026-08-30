import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials, getAvatarColor } from '../../utils/helpers';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900/60 sticky top-0 z-10 transition-colors duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-heading leading-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-900 rounded-xl px-4 py-2 w-56 transition-colors duration-200">
          <Search size={15} className="text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Quick search..."
            className="bg-transparent text-sm text-slate-600 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-full border-none outline-none focus:ring-0 focus:border-none shadow-none"
            style={{ boxShadow: 'none' }}
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950"></span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-blue-100 dark:border-slate-800" />
          ) : (
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getAvatarColor(user?.name)}`}>
              {getInitials(user?.name)}
            </div>
          )}
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">{user?.role === 'ProjectManager' ? 'Project Manager' : user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
