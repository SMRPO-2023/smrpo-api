import { PrismaClient, StoryPriority } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function getPriority(i: number): StoryPriority {
  switch (i) {
    case 0:
      return StoryPriority.MUST_HAVE;
    case 1:
      return StoryPriority.COULD_HAVE;
    case 2:
      return StoryPriority.SHOULD_HAVE;
    case 3:
      return StoryPriority.WONT_HAVE;
  }
}

async function main() {
  console.log('Clearing the database...');

  await prisma.userStory.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.projectDeveloper.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  await prisma.storyComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.timeLog.deleteMany();

  console.log('Seeding...');

  // Generate users.

  const simpsonb = await prisma.user.create({
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

  const simpsonl = await prisma.user.create({
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

  const ferrella = await prisma.user.create({
    data: {
      email: 'angelique.ferrell@gmail.com',
      firstname: 'Angelique',
      lastname: 'Ferrell',
      role: 'USER',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'ferrella',
    },
  });

  const jacksonm = await prisma.user.create({
    data: {
      email: 'micahel.jackson@gmail.com',
      firstname: 'Michael',
      lastname: 'Jackson',
      role: 'USER',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'jacksonm',
    },
  });

  const bushg = await prisma.user.create({
    data: {
      email: '911@gmail.com',
      firstname: 'George',
      lastname: 'Bush',
      role: 'USER',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'bushg',
    },
  });

  // Generate projects

  const project1 = await prisma.project.create({
    data: {
      title: 'Project 1',
      documentation: faker.random.words(20),
      projectOwnerId: simpsonl.id,
      scrumMasterId: ferrella.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'project 2',
      documentation: 'project 2 documentation.',
      projectOwnerId: ferrella.id,
      scrumMasterId: simpsonl.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Inside job',
      documentation: 'Jet fuel cant melt steel beams.',
      projectOwnerId: bushg.id,
      scrumMasterId: jacksonm.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project1.id,
      userId: ferrella.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project1.id,
      userId: jacksonm.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project1.id,
      userId: bushg.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project2.id,
      userId: simpsonl.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project2.id,
      userId: simpsonb.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project3.id,
      userId: jacksonm.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project3.id,
      userId: simpsonb.id,
    },
  });

  await prisma.projectDeveloper.create({
    data: {
      projectId: project3.id,
      userId: simpsonl.id,
    },
  });

  const projects = [project1, project2, project3];

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const sprints = [];
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-02-01T21:43:28.434Z'),
          end: new Date('2023-02-10T21:43:28.434Z'),
          velocity: 5,
          projectId: project.id,
          name: 'Sprint 1',
        },
      })
    );
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-02-10T21:43:28.434Z'),
          end: new Date('2023-02-20T21:43:28.434Z'),
          velocity: 10,
          projectId: project.id,
          name: 'sprint 2',
        },
      })
    );
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-02-20T21:43:28.434Z'),
          end: new Date('2023-03-01T21:43:28.434Z'),
          velocity: 15,
          projectId: project.id,
          name: 'sprint 3',
        },
      })
    );
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-03-10T21:43:28.434Z'),
          end: new Date('2023-03-20T21:43:28.434Z'),
          velocity: 9,
          projectId: project.id,
          name: 'sprint 4',
        },
      })
    );
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-04-01T21:43:28.434Z'),
          end: new Date('2023-04-10T21:43:28.434Z'),
          velocity: 23,
          projectId: project.id,
          name: 'sprint 5',
        },
      })
    );
    sprints.push(
      await prisma.sprint.create({
        data: {
          start: new Date('2023-04-20T21:43:28.434Z'),
          end: new Date('2023-05-01T21:43:28.434Z'),
          velocity: 20,
          projectId: project.id,
          name: 'sprint 6',
        },
      })
    );

    let counter = 0;
    for (let j = 0; j < sprints.length; j++) {
      const sprint = sprints[j];
      for (let z = 0; z < 5; z++) {
        await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.random.numeric() % 4),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: +faker.datatype.number({ min: 4, max: 15 }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            projectId: sprint.projectId,
            sprintId: sprint.id,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: true,
          },
        });
      }
      for (let z = 0; z < 2; z++) {
        await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.random.numeric() % 4),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: +faker.datatype.number({ min: 4, max: 15 }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            projectId: sprint.projectId,
            sprintId: sprint.id,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: false,
          },
        });
      }
      for (let z = 0; z < 2; z++) {
        await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.random.numeric() % 4),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: +faker.datatype.number({ min: 4, max: 15 }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            projectId: sprint.projectId,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: false,
          },
        });
      }
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
