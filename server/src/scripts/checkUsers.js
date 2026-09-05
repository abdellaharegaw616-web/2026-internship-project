const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    const users = await User.find({});
    console.log('\n📋 All users in database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (users.length === 0) {
      console.log('⚠️  No users found in database!');
    } else {
      users.forEach(user => {
        console.log(`📧 Email: ${user.email}`);
        console.log(`👤 Name: ${user.name}`);
        console.log(`🔑 Role: ${user.role}`);
        console.log(`✅ Active: ${user.isActive}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      });
    }

    const superAdmin = await User.findOne({ role: 'SuperAdmin' });
    if (superAdmin) {
      console.log('✅ SuperAdmin exists:', superAdmin.email);
    } else {
      console.log('❌ No SuperAdmin found!');
    }

    const admin = await User.findOne({ role: 'Admin' });
    if (admin) {
      console.log('✅ Admin exists:', admin.email);
    } else {
      console.log('❌ No Admin found!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
