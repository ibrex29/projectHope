import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';  // Import argon2 for password hashing

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);  // Hash the password using argon2
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
      roleName: 'support',
      description: 'The Support Department is dedicated to assisting users with any issues, questions, or requests related to our products or services.',
      isActive: true,
    }
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log('Roles seeded successfully');

  // Create the admin user and hash the password
  const hashedPassword = await hashPassword('securepassword');  // Hash the password

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,  // Use the hashed password
      isActive: true,
      authStrategy: 'local',
    },
  });

  console.log('Admin user created:', adminUser);

  // Seed the state and local governments
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: { connect: { id: adminUser.id } },  // Use the admin user here
      updatedBy: { connect: { id: adminUser.id } },  // Use the admin user here
      localGovernments: {
        create: [
          { name: 'Hadejia', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Dutse', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Kazaure', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Gwaram', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          { name: 'Ringim', createdBy: { connect: { id: adminUser.id } }, updatedBy: { connect: { id: adminUser.id } } },
          // Add other local governments here
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