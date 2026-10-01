const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const restoreSuperAdmin = async () => {
  try {
    const emailToRestore = process.argv[2] || 'superadmin@taskflow.com';

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    // Demote current SuperAdmin if exists and different
    const currentSuperAdmin = await User.findOne({ role: 'SuperAdmin' });
    
    if (currentSuperAdmin && currentSuperAdmin.email !== emailToRestore) {
      currentSuperAdmin.role = 'Admin';
      await currentSuperAdmin.save();
      console.log(`✅ Demoted current SuperAdmin (${currentSuperAdmin.email}) to Admin`);
    }

    // Find target user
    const targetUser = await User.findOne({ email: emailToRestore });
    
    if (!targetUser) {
      console.error(`❌ User with email ${emailToRestore} not found.`);
      console.log('   Please provide a valid email of an existing user.');
      console.log('   Usage: node restoreSuperAdmin.js <email>');
      process.exit(1);
    }

    // Promote target user
    targetUser.role = 'SuperAdmin';
    await targetUser.save();
    console.log(`✅ Restored SuperAdmin role to ${targetUser.email}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error restoring SuperAdmin:', error.message);
    process.exit(1);
  }
};

restoreSuperAdmin();
