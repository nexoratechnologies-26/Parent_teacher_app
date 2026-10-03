/**
 * seedUsers.js
 * Script to seed initial demo accounts (Parent, Teacher, Admin) into MongoDB.
 * Run with: node backend/src/scripts/seedUsers.js
 */

const mongoose = require('mongoose');
const User = require('../modules/auth/auth.model');
const { connectDB } = require('../config/database');

const demoUsers = [
  {
    name: 'Kishore Mohan',
    email: 'parent@school.edu',
    password: 'password123',
    role: 'PARENT',
    phone: '+91 9876543210',
  },
  {
    name: 'Sarah Jenkins',
    email: 'teacher@school.edu',
    password: 'password123',
    role: 'TEACHER',
    phone: '+91 9876543211',
  },
  {
    name: 'School Administrator',
    email: 'admin@school.edu',
    password: 'adminpassword123',
    role: 'ADMIN',
    phone: '+91 9876543212',
  },
];

const seedUsers = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Seeding initial demo users...');

    for (const userData of demoUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`✅ Created [${userData.role}]: ${userData.email} / ${userData.password}`);
      } else {
        console.log(`ℹ️  Already exists [${userData.role}]: ${userData.email}`);
      }
    }

    console.log('\n🎉 Demo users seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedUsers();
