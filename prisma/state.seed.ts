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
