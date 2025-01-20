import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10; // Adjust as needed

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Seed Roles
  console.log('Seeding roles...');
  const roles = [
    {
      roleName: 'admin',
      description: 'Has full access to all resources and can manage other users.',
      isActive: true,
    },
    {
      roleName: 'guardian',
      description: 'Responsible for managing orphans and monitoring their activities.',
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
      description: 'The Support Department assists users with issues related to our services.',
      isActive: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.create({ data: role });
  }
  console.log('Roles seeded successfully.');

  // Seed Admin User
  console.log('Seeding admin user...');
  const adminPassword = await hashPassword('securepassword');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      isActive: true,
      authStrategy: 'local',
    },
  });
  console.log('Admin user seeded successfully.');

  // Seed State and Local Governments
  console.log('Seeding states and local governments...');
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: { connect: { id: adminUser.id } },
      updatedBy: { connect: { id: adminUser.id } },
      localGovernments: {
        create: [
          { name: 'Hadejia', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Dutse', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Kazaure', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Gwaram', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Ringim', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
        ],
      },
    },
  });
  console.log('State and local governments seeded successfully:', jigawaState);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });