const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    // Check if SuperAdmin already exists
    const existingSuper = await User.findOne({ role: 'SuperAdmin' });
    if (existingSuper) {
      console.log('⚠️  SuperAdmin already exists:', existingSuper.email);
      console.log('   If you want to transfer the role, use the Team page in the UI.');
      process.exit(0);
    }

    // Create SuperAdmin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@taskflow.com',
      password: 'SuperAdmin123!',
      role: 'SuperAdmin',
      permissions: [
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
      ],
      department: 'Administration',
      isActive: true
    });

    console.log('✅ SuperAdmin created successfully!');
    console.log('   Email:', superAdmin.email);
    console.log('   Password: SuperAdmin123!');
    console.log('   Role:', superAdmin.role);
    console.log('\n⚠️  Please change the password after first login!');

    // Create an Admin as well
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: 'Admin123!',
      role: 'Admin',
      permissions: [
        'inviteUsers',
        'manageUsers',
        'manageProjects',
        'manageTasks',
        'assignTeamMembers',
        'deleteProjects',
        'deleteTasks'
      ],
      department: 'Administration',
      isActive: true
    });

    console.log('\n✅ Admin created successfully!');
    console.log('   Email:', admin.email);
    console.log('   Password: Admin123!');
    console.log('   Role:', admin.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
};

seedSuperAdmin();
