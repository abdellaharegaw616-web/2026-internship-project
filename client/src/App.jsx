import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import RoleRoute from './components/layout/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import MemberProfile from './pages/MemberProfile';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import AccessDenied from './pages/AccessDenied';
import AcceptInvitation from './pages/AcceptInvitation';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/accept-invitation/:token" element={<AcceptInvitation />} />

                {/* Protected App Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  
                  <Route path="users" element={
                    <RoleRoute allowedRoles={['SuperAdmin', 'Admin', 'ProjectManager']}>
                      <Team />
                    </RoleRoute>
                  } />
                  <Route path="users/:id" element={
                    <RoleRoute allowedRoles={['SuperAdmin', 'Admin', 'ProjectManager']}>
                      <MemberProfile />
                    </RoleRoute>
                  } />
                  
                  <Route path="projects" element={
                    <RoleRoute allowedRoles={['SuperAdmin', 'Admin', 'ProjectManager', 'TeamMember']}>
                      <Projects />
                    </RoleRoute>
                  } />
                  <Route path="projects/:id" element={
                    <RoleRoute allowedRoles={['SuperAdmin', 'Admin', 'ProjectManager', 'TeamMember']}>
                      <ProjectDetails />
                    </RoleRoute>
                  } />
                  
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="access-denied" element={<AccessDenied />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>

            </BrowserRouter>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: '12px',
                  background: '#1E293B',
                  color: '#fff',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#22C55E', secondary: '#fff' } },
                error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
              }}
            />
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
