const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const fixRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    // Fix superadmin@taskflow.com to be SuperAdmin
    const superAdminUser = await User.findOne({ email: 'superadmin@taskflow.com' });
    if (superAdminUser) {
      superAdminUser.role = 'SuperAdmin';
      superAdminUser.permissions = [
        'inviteUsers',
        'manageUsers',
        'manageProjects',
        'manageTasks',
        'assignTeamMembers',
        'viewAuditLogs',
        'sendNotifications',
        'deleteProjects',
        'deleteTasks',
        'deleteUsers'
      ];
      await superAdminUser.save();
      console.log('✅ Fixed superadmin@taskflow.com to SuperAdmin');
    }

    // Check if admin@taskflow.com is SuperAdmin, if so, change to Admin
    const adminUser = await User.findOne({ email: 'admin@taskflow.com' });
    if (adminUser && adminUser.role === 'SuperAdmin') {
      adminUser.role = 'Admin';
      adminUser.permissions = [
        'inviteUsers',
        'manageUsers',
        'manageProjects',
        'manageTasks',
        'assignTeamMembers',
        'deleteProjects',
        'deleteTasks'
      ];
      await adminUser.save();
      console.log('✅ Changed admin@taskflow.com from SuperAdmin to Admin');
    }

    console.log('\n📋 Updated accounts:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 SuperAdmin: superadmin@taskflow.com');
    console.log('   Password: SuperAdmin123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin: admin@taskflow.com');
    console.log('   Password: Admin123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixRoles();
