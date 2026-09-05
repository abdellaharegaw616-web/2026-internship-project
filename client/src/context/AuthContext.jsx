import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('taskflow_user');
    const token = localStorage.getItem('taskflow_token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('taskflow_token', data.token);
    localStorage.setItem('taskflow_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('taskflow_user', JSON.stringify(merged));
    setUser(merged);
  };

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isAdmin = user?.role === 'Admin' || isSuperAdmin;
  const isProjectManager = user?.role === 'ProjectManager';
  const canManage = isAdmin || isProjectManager;

  const PERMISSIONS = {
    MANAGE_USERS: 'MANAGE_USERS',
    MANAGE_ADMINS: 'MANAGE_ADMINS',
    MANAGE_PROJECTS: 'MANAGE_PROJECTS',
    MANAGE_SETTINGS: 'MANAGE_SETTINGS',
    VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
    MANAGE_BILLING: 'MANAGE_BILLING',
    MANAGE_TASKS: 'MANAGE_TASKS',
    MANAGE_TEAMS: 'MANAGE_TEAMS',
  };

  const ROLE_PERMISSIONS = {
    SuperAdmin: Object.values(PERMISSIONS),
    Admin: [
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_PROJECTS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.VIEW_AUDIT_LOGS,
      PERMISSIONS.MANAGE_BILLING,
      PERMISSIONS.MANAGE_TASKS,
      PERMISSIONS.MANAGE_TEAMS,
    ],
    ProjectManager: [
      PERMISSIONS.MANAGE_PROJECTS,
      PERMISSIONS.MANAGE_TASKS,
      PERMISSIONS.MANAGE_TEAMS,
    ],
    TeamMember: [
      PERMISSIONS.MANAGE_TASKS,
    ],
  };

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, login, logout, updateUser, 
      isSuperAdmin, isAdmin, isProjectManager, canManage, 
      hasPermission, PERMISSIONS 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
