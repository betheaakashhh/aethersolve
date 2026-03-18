// reset-password.js
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const hash = await bcrypt.hash('Admin@AetherSolve2024', 10);
  const updated = await prisma.admin.updateMany({
    data: { password: hash }
  });
  console.log('✅ Updated', updated.count, 'admin(s)');
  console.log('📧 Email:    admin@aethersolve.com');
  console.log('🔑 Password: Admin@AetherSolve2024');
  await prisma.$disconnect();
}

fix().catch(e => { console.error(e); process.exit(1); });