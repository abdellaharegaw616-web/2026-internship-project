import { Bell, Search, X, FileText, Folder, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getInitials, getAvatarColor } from '../../utils/helpers';
import NotificationDropdown from './NotificationDropdown';
import Avatar from '../common/Avatar';
import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';

export default function Header({ title, subtitle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setShowSearchInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchInput]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setLoading(true);
        try {
          const [tasksRes, projectsRes, usersRes] = await Promise.all([
            api.get(`/tasks?search=${searchQuery}`),
            api.get(`/projects?search=${searchQuery}`),
            api.get(`/users?search=${searchQuery}`)
          ]);
          
          const results = [
            ...(tasksRes.data.tasks || []).map(item => ({ ...item, type: 'task' })),
            ...(projectsRes.data.projects || []).map(item => ({ ...item, type: 'project' })),
            ...(usersRes.data.users || []).map(item => ({ ...item, type: 'user' }))
          ].slice(0, 10);
          
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    if (result.type === 'task') {
      navigate(`/tasks/${result._id}`);
    } else if (result.type === 'project') {
      navigate(`/projects/${result._id}`);
    } else if (result.type === 'user') {
      navigate(`/users/${result._id}`);
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'task': return <FileText size={16} className="text-blue-500" />;
      case 'project': return <Folder size={16} className="text-purple-500" />;
      case 'user': return <UserIcon size={16} className="text-green-500" />;
      default: return <Search size={16} />;
    }
  };

  const getResultLabel = (result) => {
    switch (result.type) {
      case 'task': return result.title;
      case 'project': return result.title;
      case 'user': return result.name;
      default: return '';
    }
  };

  const getResultSublabel = (result) => {
    switch (result.type) {
      case 'task': return `Task • ${result.status}`;
      case 'project': return `Project • ${result.status}`;
      case 'user': return `${result.email} • ${result.role}`;
      default: return '';
    }
  };

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900/60 sticky top-0 z-10 transition-colors duration-200">
      <div className="min-w-0 flex-1">
        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-heading leading-tight truncate">{title}</h2>
        {subtitle && <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          {/* Search Icon Button (Mobile only) */}
          <button
            onClick={() => setShowSearchInput(true)}
            className={`p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${showSearchInput ? 'hidden' : 'block md:hidden'}`}
          >
            <Search size={18} />
          </button>

          {/* Search Input (Expanded on mobile, always visible on desktop) */}
          <div className={`${showSearchInput ? 'flex' : 'hidden md:flex'} items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-900 rounded-xl px-3 py-2 w-48 md:w-64 transition-all duration-200`}>
            <Search size={15} className="text-slate-400 dark:text-slate-500 shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowResults(true)}
              className="bg-transparent text-sm text-slate-600 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 w-full border-none outline-none focus:ring-0 focus:border-none shadow-none min-w-0"
              style={{ boxShadow: 'none' }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); setShowResults(false); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
              >
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => { setShowSearchInput(false); setSearchQuery(''); setSearchResults([]); }}
              className="md:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 shrink-0"
            >
              <X size={14} />
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg z-50 overflow-hidden max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  {searchQuery.trim().length >= 2 ? 'No results found' : 'Type at least 2 characters to search'}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result._id}`}
                      onClick={() => handleResultClick(result)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                          {getResultLabel(result)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {getResultSublabel(result)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationDropdown />

        {/* Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <Avatar 
            user={user} 
            className="w-8 h-8 md:w-9 md:h-9 border-2 border-blue-100 dark:border-slate-800 text-xs md:text-sm" 
          />
          <div className="hidden sm:block">
            <p className="text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none truncate max-w-[100px] sm:max-w-[150px]">{user?.name}</p>
            <p className="text-[10px] md:text-xs text-slate-450 dark:text-slate-500 mt-0.5 truncate max-w-[100px] sm:max-w-[150px]">{user?.role === 'ProjectManager' ? 'Project Manager' : user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
