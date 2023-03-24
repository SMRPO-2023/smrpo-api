import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  console.log('Seeding...');

  const user1 = await prisma.user.create({
    data: {
      email: 'lisa@simpson.com',
      firstname: 'Lisa',
      lastname: 'Simpson',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      role: 'USER',
      username: 'simpsonl',
    },
  });
  const user2 = await prisma.user.create({
    data: {
      email: 'bart@simpson.com',
      firstname: 'Bart',
      lastname: 'Simpson',
      role: 'ADMIN',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'simpsonb',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'user@gmail.com',
      firstname: 'firstname',
      lastname: 'lastname',
      role: 'ADMIN',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'user',
    },
  });

  const project1 = await prisma.project.create({
    data: {
      title: 'project 1',
      documentation: 'project 1 documentation',
      projectOwnerId: user2.id,
      scrumMasterId: user2.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'project 2',
      documentation: 'project 2 documentation',
      projectOwnerId: user3.id,
      scrumMasterId: user1.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'project 3',
      documentation: 'project 3 documentation',
      projectOwnerId: user2.id,
      scrumMasterId: user3.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user1.id,
      projectId: project1.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user1.id,
      projectId: project2.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user1.id,
      projectId: project3.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user2.id,
      projectId: project1.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user2.id,
      projectId: project2.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user3.id,
      projectId: project1.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      userId: user3.id,
      projectId: project3.id,
    },
  });

  const sprint1 = await prisma.sprint.create({
    data: {
      start: new Date('2023-03-17T21:43:28.434Z'),
      end: new Date('2023-03-14T21:43:28.434Z'),
      velocity: 5,
      projectId: project1.id,
      name: 'sprint 1',
    },
  });

  const sprint2 = await prisma.sprint.create({
    data: {
      start: new Date('2023-04-17T21:43:28.434Z'),
      end: new Date('2023-04-22T21:43:28.434Z'),
      velocity: 10,
      projectId: project1.id,
      name: 'sprint 2',
    },
  });

  const sprint3 = await prisma.sprint.create({
    data: {
      start: new Date('2023-05-17T21:43:28.434Z'),
      end: new Date('2023-05-22T21:43:28.434Z'),
      velocity: 15,
      projectId: project1.id,
      name: 'sprint 3',
    },
  });

  await prisma.sprint.create({
    data: {
      start: new Date('2023-01-11T21:43:28.434Z'),
      end: new Date('2023-01-18T21:43:28.434Z'),
      velocity: 9,
      projectId: project2.id,
      name: 'sprint 4',
    },
  });

  await prisma.sprint.create({
    data: {
      start: new Date('2023-02-01T21:43:28.434Z'),
      end: new Date('2023-02-15T21:43:28.434Z'),
      velocity: 23,
      projectId: project2.id,
      name: 'sprint 5',
    },
  });

  await prisma.sprint.create({
    data: {
      start: new Date('2023-03-12T21:43:28.434Z'),
      end: new Date('2023-03-22T21:43:28.434Z'),
      velocity: 20,
      projectId: project2.id,
      name: 'sprint 6',
    },
  });

  const story1 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 1',
      description: 'story 1 description',
      points: 3,
      businessValue: 0,
      projectId: project3.id,
      sprintId: sprint1.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story2 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 2',
      description: 'story 2 description',
      points: 3,
      businessValue: 1,
      projectId: project2.id,
      sprintId: sprint2.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story3 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 3',
      description: 'story 3 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      sprintId: sprint3.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story4 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 4',
      description: 'story 4 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story5 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 5',
      description: 'story 5 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story6 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 6',
      description: 'story 6 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      sprintId: sprint3.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story7 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 7',
      description: 'story 7 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      sprintId: sprint3.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story8 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 7',
      description: 'story 7 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      sprintId: sprint3.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  const story9 = await prisma.userStory.create({
    data: {
      priority: 'MUST_HAVE',
      title: 'story 7',
      description: 'story 7 description',
      points: 7,
      businessValue: 5,
      projectId: project1.id,
      sprintId: sprint3.id,
      acceptanceCriteria: 'acceptanceCriteria',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
