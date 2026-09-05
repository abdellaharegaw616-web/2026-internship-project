import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;
