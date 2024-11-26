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
      description:
        'The Support Department is dedicated to assisting users with any issues, questions, or requests related to our products or services.',
      isActive: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: role,
    });
  }

  console.log('Roles seeded successfully');

  // First, create a user
  const user = await prisma.user.create({
    data: {
      email: '[email protected]',
      password: 'Password123!',
      roles: { connect: { roleName: 'admin' } },
    },
  });

  console.log('User ID:', user.id);

  // Then, create the state and connect it to the user
  const jigawaState = await prisma.state.create({
    data: {
      name: 'Jigawa',
      createdBy: { connect: { id: user.id } },
      updatedBy: { connect: { id: user.id } },
      localGovernments: {
        create: [
          {
            name: 'Hadejia',
            createdBy: { connect: { id: user.id } },
            updatedBy: { connect: { id: user.id } },
          },
          {
            name: 'Dutse',
            createdBy: { connect: { id: user.id } },
            updatedBy: { connect: { id: user.id } },
          },
          {
            name: 'Kazaure',
            createdBy: { connect: { id: user.id } },
            updatedBy: { connect: { id: user.id } },
          },
          {
            name: 'Gwaram',
            createdBy: { connect: { id: user.id } },
            updatedBy: { connect: { id: user.id } },
          },
          {
            name: 'Ringim',
            createdBy: { connect: { id: user.id } },
            updatedBy: { connect: { id: user.id } },
          },
          // Add other local governments here
        ],
      },
    },
  });

  console.log('State seeded successfully');

  // Seed Users and Profiles
  const guardian = await prisma.user.create({
    data: {
      email: 'guardian1@example.com',
      password: 'Password123!',
      roles: { connect: { roleName: 'guardian' } },
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Guardian',
          phoneNumber: '+2348012345678',
          gender: 'MALE',
        },
      },
    },
  });

  const sponsor = await prisma.user.create({
    data: {
      email: 'sponsor1@example.com',
      password: 'Password123!',
      roles: { connect: { roleName: 'sponsor' } },
      profile: {
        create: {
          firstName: 'Jane',
          lastName: 'Sponsor',
          phoneNumber: '+2348012345679',
          gender: 'FEMALE',
        },
      },
    },
  });

  // Seed Orphans
  const orphan = await prisma.orphan.create({
    data: {
      trackingNumber: 'ORPH-001',
      isAccepted: true,
      affidavitOfGuardianship: 'https://example.com/affidavit.pdf',
      user: {
        create: {
          email: 'orphan1@example.com',
          password: 'Password123!',
          profile: {
            create: {
              firstName: 'Tom',
              lastName: 'Orphan',
              phoneNumber: '+2348012345680',
              gender: 'MALE',
            },
          },
        },
      },
    },
  });

  // Seed Requests
  const request = await prisma.request.create({
    data: {
      status: 'Pending',
      description: 'Request for school fees sponsorship',
      orphan: { connect: { id: orphan.id } },
      user: { connect: { id: guardian.id } },
    },
  });

  // Seed Needs
  await prisma.need.create({
    data: {
      name: 'School Fees',
      description: 'Tuition fees for the academic year',
      request: { connect: { id: request.id } },
    },
  });

  // Seed Donations (Sponsorships Gotten)
  await prisma.donation.create({
    data: {
      amountNeeded: 500.0,
      amountRecieved: 300.0,
      amountDonated: 300.0,
      request: { connect: { id: request.id } },
      user: { connect: { id: sponsor.id } },
    },
  });

  console.log('Mock data for dashboard metrics seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
