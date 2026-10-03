/**
 * seedSupabase.mjs
 * Seeds Demo Parent, Teacher, and Admin accounts and initial data directly into Supabase.
 * Run with: node scripts/seedSupabase.mjs
 */

const SUPABASE_URL = 'https://sbwhdfqxurstvmsgsnjh.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNid2hkZnF4dXJzdHZtc2dzbmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwNDA0OTIsImV4cCI6MjEwNjYxNjQ5Mn0.S1EXE_UNzsJVS6jYAJq-EO_znRVdTl5H4ZZL7xH7dJQ';

const demoUsers = [
  {
    email: 'parent.demo@gmail.com',
    password: 'password123',
    data: {
      name: 'Kishore Mohan',
      role: 'PARENT',
      phone: '+91 9876543210',
    },
  },
  {
    email: 'teacher.demo@gmail.com',
    password: 'password123',
    data: {
      name: 'Sarah Jenkins',
      role: 'TEACHER',
      phone: '+91 9876543211',
    },
  },
  {
    email: 'admin.demo@gmail.com',
    password: 'adminpassword123',
    data: {
      name: 'School Administrator',
      role: 'ADMIN',
      phone: '+91 9876543212',
    },
  },
];

async function seedAuthUsers() {
  console.log('🚀 Seeding Demo Users into Supabase Auth...');

  for (const u of demoUsers) {
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: u.email,
          password: u.password,
          data: u.data,
        }),
      });

      const json = await res.json();

      if (res.ok && (json.id || json.user?.id)) {
        console.log(`✅ Created [${u.data.role}]: ${u.email} (Password: ${u.password})`);
      } else if (
        json.msg?.includes('already') ||
        json.error_description?.includes('already') ||
        json.message?.includes('already')
      ) {
        console.log(`ℹ️  Already registered [${u.data.role}]: ${u.email}`);
      } else {
        console.log(`ℹ️  [${u.data.role}] ${u.email} -> ${json.msg || json.message || JSON.stringify(json)}`);
      }
    } catch (err) {
      console.error(`❌ Failed to seed ${u.email}:`, err.message);
    }
  }
}

async function run() {
  await seedAuthUsers();
  console.log('\n✨ Supabase Seed Complete! You can now log in with the demo accounts.');
}

run();
