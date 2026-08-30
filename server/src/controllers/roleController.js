const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private (Admin only)
const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find().sort({ name: 1 });
    res.json({ success: true, roles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single role
// @route   GET /api/roles/:id
// @access  Private (Admin only)
const getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    res.json({ success: true, role });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new role
// @route   POST /api/roles
// @access  Private (Admin only)
const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ success: false, message: 'Role with this name already exists' });
    }

    const role = await Role.create({
      name,
      description,
      permissions: permissions || [],
    });

    res.status(201).json({ success: true, role });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role
// @route   PUT /api/roles/:id
// @access  Private (Admin only)
const updateRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    // Cannot update system roles
    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot update system roles' });
    }

    const { name, description, permissions } = req.body;

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (permissions !== undefined) role.permissions = permissions;

    await role.save();

    res.json({ success: true, role });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete role
// @route   DELETE /api/roles/:id
// @access  Private (Admin only)
const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found' });
    }

    // Cannot delete system roles
    if (role.isSystem) {
      return res.status(400).json({ success: false, message: 'Cannot delete system roles' });
    }

    await role.deleteOne();

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize default roles
// @route   POST /api/roles/initialize
// @access  Private (Admin only)
const initializeDefaultRoles = async (req, res, next) => {
  try {
    const defaultRoles = [
      {
        name: 'Admin',
        description: 'Full system access',
        permissions: [
          { resource: 'tasks', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'projects', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'departments', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'leaves', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'skills', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'performance_reviews', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'reports', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'settings', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'audit_logs', actions: ['create', 'read', 'update', 'delete', 'manage'] },
        ],
        isSystem: true,
      },
      {
        name: 'ProjectManager',
        description: 'Project management access',
        permissions: [
          { resource: 'tasks', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'projects', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'users', actions: ['read'] },
          { resource: 'departments', actions: ['read'] },
          { resource: 'leaves', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'skills', actions: ['read'] },
          { resource: 'performance_reviews', actions: ['create', 'read', 'update', 'delete', 'manage'] },
          { resource: 'reports', actions: ['read'] },
        ],
        isSystem: true,
      },
      {
        name: 'TeamMember',
        description: 'Basic team member access',
        permissions: [
          { resource: 'tasks', actions: ['read', 'update'] },
          { resource: 'projects', actions: ['read'] },
          { resource: 'users', actions: ['read'] },
          { resource: 'departments', actions: ['read'] },
          { resource: 'leaves', actions: ['create', 'read', 'update'] },
          { resource: 'skills', actions: ['create', 'read', 'update', 'delete'] },
          { resource: 'performance_reviews', actions: ['read'] },
        ],
        isSystem: true,
      },
    ];

    const createdRoles = [];
    for (const roleData of defaultRoles) {
      const existing = await Role.findOne({ name: roleData.name });
      if (!existing) {
        const role = await Role.create(roleData);
        createdRoles.push(role);
      }
    }

    res.json({ 
      success: true, 
      message: 'Default roles initialized',
      created: createdRoles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  initializeDefaultRoles,
};
