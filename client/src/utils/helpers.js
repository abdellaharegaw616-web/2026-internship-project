// Format a date to readable string
export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

// Days remaining from now
export const getDaysRemaining = (endDate) => {
  if (!endDate) return null;
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24));
  return diff;
};

// Check if a task is overdue
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'Done') return false;
  return new Date(dueDate) < new Date();
};

// Relative time string (e.g. "2 hours ago")
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  for (const { label, seconds: s } of intervals) {
    const count = Math.floor(seconds / s);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

// Get initials from name
export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Avatar color based on user role
export const getAvatarColor = (role = '') => {
  const roleColors = {
    Admin: 'bg-gradient-to-br from-purple-500 to-purple-600',
    ProjectManager: 'bg-gradient-to-br from-blue-500 to-blue-600',
    TeamMember: 'bg-gradient-to-br from-green-500 to-green-600',
  };
  return roleColors[role] || 'bg-gradient-to-br from-slate-500 to-slate-600';
};

// Format currency
export const formatCurrency = (amount) => {
  if (amount == null) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

// Priority badge class
export const getPriorityClass = (priority) => {
  const map = { Urgent: 'badge-urgent', High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' };
  return `badge ${map[priority] || 'badge-low'}`;
};

// Status badge class for tasks
export const getTaskStatusClass = (status) => {
  const map = {
    'Todo': 'badge-todo',
    'In Progress': 'badge-inprogress',
    'Review': 'badge-review',
    'Done': 'badge-done',
  };
  return `badge ${map[status] || 'badge-todo'}`;
};

// Status badge class for projects
export const getProjectStatusClass = (status) => {
  const map = {
    'Planning': 'badge-planning',
    'Active': 'badge-active',
    'On Hold': 'badge-onhold',
    'Completed': 'badge-completed',
  };
  return `badge ${map[status] || 'badge-planning'}`;
};

// Role badge class
export const getRoleClass = (role) => {
  const map = { Admin: 'badge-admin', ProjectManager: 'badge-pm', TeamMember: 'badge-member' };
  return `badge ${map[role] || 'badge-member'}`;
};

// Role display name
export const getRoleLabel = (role) => {
  const map = { Admin: 'Admin', ProjectManager: 'Project Manager', TeamMember: 'Team Member' };
  return map[role] || role;
};

// Construct full URL for backend static files
export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
