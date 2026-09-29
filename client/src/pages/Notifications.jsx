import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, ExternalLink } from 'lucide-react';
import Header from '../components/layout/Header';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications');
      const notifs = Array.isArray(data) ? data : data.notifications || [];
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      toast.success('Marked as read');
    } catch (err) {
      console.error('Failed to mark as read', err);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Failed to mark all as read', err);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Failed to delete notification', err);
      toast.error('Failed to delete notification');
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 60) return `${diffMins || 1}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${diffDays}d ago`;
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="page-enter">
      <Header title="Notifications" subtitle={`You have ${unreadCount} unread notifications`} />
      <div className="p-4 md:p-8">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'read'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
              }`}
            >
              Read
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
            <Bell size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
            <p className="text-gray-500 dark:text-slate-400">
              {filter === 'unread' ? 'You have no unread notifications' : 'You have no notifications'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="divide-y divide-gray-100 dark:divide-slate-700">
              {filteredNotifications.map(n => (
                <div
                  key={n._id}
                  className={`p-6 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${!n.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {!n.isRead && (
                        <div className="w-3 h-3 rounded-full bg-blue-500 mt-1.5"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-slate-300'}`}>
                          {n.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 ${!n.isRead ? 'text-gray-600 dark:text-slate-400' : 'text-gray-500 dark:text-slate-500'}`}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n._id)}
                            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Check size={14} /> Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(n._id)}
                          className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
