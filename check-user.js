
const { PrismaClient } = require('@prisma/client');

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address as an argument.');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:Magangits@db.cdengzwpmqsehwacbboi.supabase.co:5432/postgres',
      },
    },
  });

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      console.log('User found:');
      console.log(user);
    } else {
      console.log(`User with email "${email}" not found.`);
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
