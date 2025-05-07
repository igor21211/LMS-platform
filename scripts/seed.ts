import { PrismaClient } from '../lib/generated/prisma/client';

const db = new PrismaClient();

async function seed() {
  try {
    // Удаляем все существующие категории
    await db.category.deleteMany({});

    await db.category.createMany({
      data: [
        { name: 'Java' },
        { name: 'JavaScript' },
        { name: 'Python' },
        { name: 'TypeScript' },
        { name: 'Next.js' },
        { name: 'Spring Framework' },
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'C#' },
        { name: 'C++' },
        { name: 'Ruby' },
        { name: 'PHP' },
        { name: 'SQL' },
      ],
    });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.$disconnect();
  }
}

seed();
