import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; //import bcrypt from 'bcrypt' does not work. That is why the asterisk import is used.

const prisma = new PrismaClient();

const saltRounds = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Seed Roles
  const roles = [
    {
      roleName: 'admin',
      description:
        'Has full access to all resources and can manage other users.',
      isActive: true,
    },
    {
      roleName: 'guardian',
      description:
        'Responsible for managing orphans and monitoring their activities.',
      isActive: true,
    },
    {
      roleName: 'sponsor',
      description: 'Supports orphans financially and can view their progress.',
      isActive: true,
    },
    {
      roleName: 'orphan',
      description: 'User type for orphans, limited access to resources.',
      isActive: true,
    },
    {
      roleName: 'Support',
      description:
        'The Support Department assists users with issues, questions, or requests.',
      isActive: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log('Roles seeded successfully');

  // Seed Admin User
  const hashedPassword = await hashPassword('securepassword');

  // Create sample users (adjust as needed)
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword, // Use hashed password
      isActive: true,
      authStrategy: 'local',
      roles: {
        connect: {
          roleName: 'admin',
        },
      },
    },
  });

  console.log('Admin user seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
