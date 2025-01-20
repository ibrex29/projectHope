import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';  // Or bcrypt depending on your choice

const prisma = new PrismaClient();
const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Example of creating an admin user with a hashed password
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: await hashPassword('securepassword'),  // Ensure password is hashed
      isActive: true,
      authStrategy: 'local',
    },
  });

  console.log('Admin user created with hashed password:', adminUser);

  // Continue with other seeding logic as needed...
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });