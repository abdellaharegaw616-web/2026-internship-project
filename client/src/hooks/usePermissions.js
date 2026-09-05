import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { hasPermission, PERMISSIONS } = useAuth();
  return { hasPermission, PERMISSIONS };
};
