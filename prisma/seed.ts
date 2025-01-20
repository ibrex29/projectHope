import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      description: 'The Support Department is dedicated to assisting users with any issues, questions, or requests related to our products or services.',
      isActive: true,
    }
  ];

  // Create roles in the database
  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log('Roles seeded successfully');

  // Seed an admin user with a hashed password
  const hashedPassword = await hashPassword('securepassword');  // Hash the password
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      isActive: true,
      authStrategy: 'local',
    },
  });

  console.log('Admin user created with hashed password:', adminUser);

  // Seed the state and local governments
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: { connect: { id: adminUser.id } },  // Connect to the admin user
      updatedBy: { connect: { id: adminUser.id } },
      localGovernments: {
        create: [
          { name: 'Hadejia', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Dutse', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Kazaure', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Gwaram', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Ringim', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          // Add other local governments here if needed
        ],
      },
    },
  });

  console.log('Seeded state with local governments:', jigawaState);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });