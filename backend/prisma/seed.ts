import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // 1. Create a dummy Company/Tenant if it doesn't exist
  let company = await prisma.company.findFirst();
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'Avario Master Tenant',
        address: 'HQ',
      },
    });
    console.log('Created Master Company');
  }

  // 2. Create an Owner Role if it doesn't exist
  let ownerRole = await prisma.role.findFirst({ where: { name: 'Owner' } });
  if (!ownerRole) {
    ownerRole = await prisma.role.create({
      data: {
        name: 'Owner',
        company_id: company.id,
        description: 'Super Admin / Master Owner of the SaaS',
      },
    });
    console.log('Created Owner Role');
  }

  // 3. Create the Master User (owner/owner)
  const masterUsername = 'owner';
  const masterPassword = 'owner';

  const existingOwner = await prisma.user.findUnique({
    where: { username: masterUsername },
  });

  if (!existingOwner) {
    const hashedPassword = await bcrypt.hash(masterPassword, 10);
    await prisma.user.create({
      data: {
        username: masterUsername,
        password: hashedPassword,
        name: 'Master Owner',
        email: 'owner@avario.com',
        company_id: company.id,
        role_id: ownerRole.id,
        status: true,
      },
    });
    console.log('Created Master User: owner / owner');
  } else {
    console.log('Master User already exists. Skipping...');
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
