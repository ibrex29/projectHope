import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10; // Adjust as needed

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function main() {
  // Hash the password
  const hashedPassword = await hashPassword('securepassword');

  // Create sample users (adjust as needed)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword, // Use hashed password
      isActive: true,
      authStrategy: 'local',
    },
  });

  // Seed the state and local governments
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: { connect: { id: adminUser.id } }, // Link to created admin user
      updatedBy: { connect: { id: adminUser.id } }, // Link to created admin user
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

  console.log('Seeded state:', jigawaState);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
