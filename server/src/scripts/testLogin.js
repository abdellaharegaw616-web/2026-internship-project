const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/taskflow');
    console.log('✅ Connected to MongoDB');

    // Find superadmin
    const superAdmin = await User.findOne({ email: 'superadmin@taskflow.com' }).select('+password');
    
    if (!superAdmin) {
      console.log('❌ SuperAdmin not found');
      process.exit(1);
    }

    console.log('✅ SuperAdmin found:');
    console.log('   Email:', superAdmin.email);
    console.log('   Role:', superAdmin.role);
    console.log('   Active:', superAdmin.isActive);
    console.log('   Password hash length:', superAdmin.password.length);

    // Test password comparison
    const testPassword = 'SuperAdmin123!';
    const isMatch = await bcrypt.compare(testPassword, superAdmin.password);
    
    console.log('\n🔐 Password test:');
    console.log('   Testing password:', testPassword);
    console.log('   Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password does not match');
      
      // Reset password
      console.log('\n🔄 Resetting password...');
      superAdmin.password = testPassword;
      await superAdmin.save();
      console.log('✅ Password reset successfully');
      
      // Test again
      const superAdmin2 = await User.findOne({ email: 'superadmin@taskflow.com' }).select('+password');
      const isMatch2 = await bcrypt.compare(testPassword, superAdmin2.password);
      console.log('   New password match:', isMatch2);
    } else {
      console.log('✅ Password matches correctly');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();
