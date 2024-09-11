// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// async function main() {
//   // Seed Roles
//   const roles = [
//     {
//       roleName: 'admin',
//       description: 'Has full access to all resources and can manage other users.',
//       isActive: true,
//     },
//     {
//       roleName: 'guardian',
//       description: 'Responsible for managing orphans and monitoring their activities.',
//       isActive: true,
//     },
//     {
//       roleName: 'sponsor',
//       description: 'Supports orphans financially and can view their progress.',
//       isActive: true,
//     },
//     {
//       roleName: 'orphan',
//       description: 'User type for orphans, limited access to resources.',
//       isActive: true,
//     },
//     {
//       roleName: 'Support',
//       description: 'The Support Department is dedicated to assisting users with any issues, questions, or requests related to our products or services.',
//       isActive: true,
//     }
//   ];

//   for (const role of roles) {
//     await prisma.role.create({
//       data: role,
//     });
//   }

//   console.log('Roles seeded successfully');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed the state
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: 'system', // Adjust as needed
      updatedBy: 'system', // Adjust as needed
      localGovernments: {
        create: [
          { name: 'Hadejia', createdBy: 'system', updatedBy: 'system' },
          { name: 'Dutse', createdBy: 'system', updatedBy: 'system' },
          { name: 'Kazaure', createdBy: 'system', updatedBy: 'system' },
          { name: 'Gwaram', createdBy: 'system', updatedBy: 'system' },
          { name: 'Ringim', createdBy: 'system', updatedBy: 'system' },
          // Add other local governments here
        ],
      },
    },
  });

  console.log('Seeded state:', jigawaState);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



