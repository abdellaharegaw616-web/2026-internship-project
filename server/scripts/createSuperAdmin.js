require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    let sa = await User.findOne({ email: 'superadmin@smartit.com' });
    if (!sa) {
      sa = new User({
        name: 'System SuperAdmin',
        email: 'superadmin@smartit.com',
        role: 'SuperAdmin',
        password: 'admin123',
        isActive: true
      });
      await sa.save();
      console.log('SuperAdmin created: superadmin@smartit.com / admin123');
    } else {
      sa.password = 'admin123';
      sa.role = 'SuperAdmin';
      await sa.save();
      console.log('SuperAdmin password reset to: admin123');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error', err);
    process.exit(1);
  });
