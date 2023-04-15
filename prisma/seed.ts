import {
  PrismaClient,
  Sprint,
  StoryPriority,
  Task,
  TaskStatus,
} from '@prisma/client';
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
  await prisma.post.deleteMany();
  await prisma.storyComment.deleteMany();
  await prisma.timeLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hernandezc = await prisma.user.create({
    data: {
      email: 'concetta.hernandez@gmail.com',
      firstname: 'Concetta',
      lastname: 'Hernandez',
      role: 'USER',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      username: 'hernandezc',
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

  const devs = [
    {
      project: 0,
      firstName: 'Barack',
      lastName: 'Obama',
    },
    {
      project: 0,
      firstName: 'Elon',
      lastName: 'Musk',
    },
    {
      project: 0,
      firstName: 'Beyonce',
      lastName: 'Baby',
    },
    {
      project: 0,
      firstName: 'Christiano',
      lastName: 'Ronaldo',
    },
    {
      project: 1,
      firstName: 'Oprah',
      lastName: 'Winfrey',
    },
    {
      project: 1,
      firstName: 'Daddy',
      lastName: 'Jeff',
    },
    {
      project: 1,
      firstName: 'Taylor',
      lastName: 'Swiftie',
    },
    {
      project: 1,
      firstName: 'Serena',
      lastName: 'Williams',
    },
    {
      project: 2,
      firstName: 'Albert',
      lastName: 'Einstein',
    },
    {
      project: 2,
      firstName: 'Bill',
      lastName: 'Gates',
    },
    {
      project: 2,
      firstName: 'Emma',
      lastName: 'Watson',
    },
    {
      project: 2,
      firstName: 'Dwayne',
      lastName: 'Johnson',
    },
  ];

  for (let i = 0; i < 15; i++) {
    devs.push({
      project: i % 3,
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    });
  }

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

  const projects = [project1, project2, project3];

  for (const dev of devs) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.userName(dev.firstName, dev.lastName),
        firstname: dev.firstName,
        lastname: dev.lastName,
        role: 'USER',
        // cspell:disable-next-line -- disables checking till the end of the next line.
        password:
          '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
        username: dev.firstName.toLowerCase() + dev.lastName.toLowerCase()[0],
      },
    });
    await prisma.projectDeveloper.create({
      data: {
        projectId: projects[dev.project].id,
        userId: user.id,
      },
    });
  }

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
      projectId: project2.id,
      userId: hernandezc.id,
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
          start: new Date('2023-04-10T21:43:28.434Z'),
          end: new Date('2023-04-15T21:43:28.434Z'),
          velocity: 30,
          projectId: project.id,
          name: 'sprint 6',
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
          name: 'sprint 7',
        },
      })
    );

    let counter = 0;
    for (const sprint of sprints) {
      // Create user stories with sprint assigned
      let total_points = 0;
      for (let z = 0; z < 10; z++) {
        if (total_points >= sprint.velocity - 8) {
          break;
        }
        const userStory = await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.datatype.number({ min: 0, max: 2 })),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: +faker.datatype.number({
              min: 4,
              max: Math.min(sprint.velocity - total_points),
            }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            projectId: sprint.projectId,
            sprintId: sprint.id,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: boolRand(0.6),
          },
        });
        total_points += userStory.points;
        await createTask(userStory, sprint);
      }

      // Create user stories with no sprint assigned and WON'T HAVE TIME priority
      for (let z = 0; z < 2; z++) {
        if (total_points >= sprint.velocity - 2) {
          break;
        }
        const userStory = await prisma.userStory.create({
          data: {
            priority: getPriority(3),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: +faker.datatype.number({
              min: 2,
              max: Math.min(4, sprint.velocity - total_points),
            }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            projectId: sprint.projectId,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: false,
          },
        });
        total_points += userStory.points;
        await createTask(userStory, sprint);
      }
    }
  }

  console.log('Seeding finished.');
}

async function createTask(userStory: any, sprint: any) {
  const project = await prisma.project.findFirst({
    where: { id: sprint.projectId },
    include: {
      developers: {
        include: { user: { select: { id: true } } },
      },
    },
  });
  const userId = (
    await project.developers[
      faker.datatype.number({ min: 0, max: (await project.developers).length })
    ]
  )?.user?.id;
  const task = await prisma.task.create({
    data: {
      userId,
      userStoryId: userStory.id,
      title: faker.random.words(5),
      description: faker.random.words(25),
      sprintId: sprint.id,
      done: boolRand(0.2),
      hours: faker.datatype.float({ min: 4, max: 15, precision: 0.1 }),
      status:
        !userId || !userStory.sprintId
          ? TaskStatus.UNASSIGNED
          : boolRand(0.33)
          ? TaskStatus.ACCEPTED
          : TaskStatus.ASSIGNED,
    },
  });
  if (task.status === TaskStatus.ASSIGNED) {
    await createTimeLog(sprint, userId, task);
  }
}

async function createTimeLog(sprint: Sprint, userId: number, task: Task) {
  for (let i = 0; i < faker.datatype.number({ min: 2, max: 5 }); i++) {
    await prisma.timeLog.create({
      data: {
        day: sprint.start,
        hours: faker.datatype.float({ min: 1, max: 4, precision: 0.1 }),
        userId,
        remainingHours: faker.datatype.float({
          min: 1,
          max: 8,
          precision: 0.5,
        }),
        taskId: task.id,
      },
    });
  }
  if (task.done) {
    await prisma.timeLog.create({
      data: {
        day: sprint.end,
        hours: faker.datatype.float({ min: 1, max: 4, precision: 0.1 }),
        userId,
        remainingHours: 0,
        taskId: task.id,
      },
    });
  }
}

function boolRand(prob: number) {
  return faker.datatype.float({ min: 0.0, max: 1.0, precision: 0.01 }) <= prob;
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
