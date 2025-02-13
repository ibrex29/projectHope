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
      localGovernments: {
        create: [
          { name: 'Hadejia',  },
          { name: 'Dutse',  },
          { name: 'Kazaure'},
          { name: 'Gwaram',  },
          { name: 'Ringim', },
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
