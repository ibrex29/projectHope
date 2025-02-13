import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      description: 'The Support Department assists users with issues, questions, or requests.',
      isActive: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log('Roles seeded successfully');

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'password',
      isActive: true,
      authStrategy: 'local',
    },
  });

  console.log('Admin user seeded successfully');

  // Seed the state and local governments
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      localGovernments: {
        create: [
          { name: 'Hadejia' },
          { name: 'Dutse' },
          { name: 'Kazaure' },
          { name: 'Gwaram' },
          { name: 'Ringim' },
          // Add other local governments here
        ],
      },
    },
  });

  console.log('Seeded state with local governments:', jigawaState);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
