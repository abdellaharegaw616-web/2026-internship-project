import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

export default function Avatar({ user, className = '', title }) {
  if (!user) {
    return (
      <div className={`flex items-center justify-center text-white font-semibold shrink-0 bg-slate-300 dark:bg-slate-700 ${className.includes('rounded') ? '' : 'rounded-full'} ${className}`} title={title}>
        ?
      </div>
    );
  }

  if (user.avatar) {
    const avatarSrc = user.avatar.startsWith('http') 
      ? user.avatar 
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar}`;

    return (
      <img
        src={avatarSrc}
        alt={user.name || 'User'}
        className={`object-cover shrink-0 ${className.includes('rounded') ? '' : 'rounded-full'} ${className}`}
        title={title || user.name}
      />
    );
  }

  const roleForColor = user.role || '';

  return (
    <div
      className={`flex items-center justify-center text-white font-semibold shrink-0 ${getAvatarColor(roleForColor)} ${className.includes('rounded') ? '' : 'rounded-full'} ${className}`}
      title={title || user.name}
    >
      {getInitials(user.name)}
    </div>
  );
}
