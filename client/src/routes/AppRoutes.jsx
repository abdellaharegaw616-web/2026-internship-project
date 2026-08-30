import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Dashboard Pages
import Dashboard from '../pages/dashboard/Dashboard';

// User Pages
import Users from '../pages/users/Users';
import UserDetails from '../pages/users/UserDetails';

// Project Pages
import ProjectList from '../pages/projects/ProjectList';
import CreateProject from '../pages/projects/CreateProject';
import ProjectDetails from '../pages/projects/ProjectDetails';

// Task Pages
import TaskList from '../pages/tasks/TaskList';
import CreateTask from '../pages/tasks/CreateTask';
import TaskDetails from '../pages/tasks/TaskDetails';

// Settings Pages
import Profile from '../pages/settings/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* User Routes */}
        <Route path="users" element={<Users />} />
        <Route path="users/:id" element={<UserDetails />} />

        {/* Project Routes */}
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/create" element={<CreateProject />} />
        <Route path="projects/:id" element={<ProjectDetails />} />

        {/* Task Routes */}
        <Route path="tasks" element={<TaskList />} />
        <Route path="tasks/create" element={<CreateTask />} />
        <Route path="tasks/:id" element={<TaskDetails />} />

        {/* Settings Routes */}
        <Route path="settings" element={<Profile />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
