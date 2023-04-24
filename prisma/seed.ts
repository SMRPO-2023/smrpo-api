import {
  PrismaClient,
  Sprint,
  StoryPriority,
  Task,
  TaskStatus,
  UserStory,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dayjs from 'dayjs';

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

  await prisma.storyComment.deleteMany();
  await prisma.userStory.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.projectDeveloper.deleteMany();
  await prisma.post.deleteMany();
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
      description: faker.random.words(20),
      projectOwnerId: simpsonl.id,
      scrumMasterId: ferrella.id,
      documentation: `# Project 1

      This is project 1 documentation.`,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'project 2',
      description: 'project 2 description.',
      projectOwnerId: ferrella.id,
      scrumMasterId: simpsonl.id,
      documentation: `# Project 2

      This is project 2 documentation.`,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Inside job',
      description: 'Jet fuel cant melt steel beams.',
      projectOwnerId: bushg.id,
      scrumMasterId: jacksonm.id,
      documentation: `# Project 3

      This is project 3 documentation.`,
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
        password:
          // cspell:disable-next-line -- disables checking till the end of the next line.
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

  for (const project of projects) {
    const sprints = [];

    for (let s = -3; s <= 3; s++) {
      let startDate = dayjs().add(s * 10 - 5, 'd');
      let endDate = dayjs().add(s * 10 + 4, 'd');
      while ([0, 6].includes(startDate.day())) {
        startDate = startDate.add(1, 'd');
      }
      while ([0, 6].includes(endDate.day())) {
        endDate = endDate.subtract(1, 'd');
      }
      sprints.push(
        await prisma.sprint.create({
          data: {
            start: startDate.toDate(),
            end: endDate.toDate(),
            velocity: faker.datatype.float({
              min: 30,
              max: 90,
              precision: 0.5,
            }),
            projectId: project.id,
            name: `Sprint ${s + 4}`,
          },
        })
      );
    }

    let counter = 0;
    for (const sprint of sprints) {
      // Create user stories with sprint assigned
      let total_points = 0;
      // Only with finished tasks, but not yet accepted
      for (let z = 0; z < 4; z++) {
        const userStory = await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.datatype.number({ min: 0, max: 2 })),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: faker.datatype.float({
              min: 1,
              max: Math.min(sprint.velocity - total_points, 2),
              precision: 0.5,
            }),
            businessValue: +faker.datatype.number({ min: 1, max: 10 }),
            projectId: sprint.projectId,
            sprintId: sprint.id,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: false,
          },
        });
        total_points += userStory.points;
        await createTasks(userStory, sprint, true);
      }
      // Random
      for (let z = 0; z < 20; z++) {
        if (total_points >= sprint.velocity - 8) {
          break;
        }
        const userStory = await prisma.userStory.create({
          data: {
            priority: getPriority(+faker.datatype.number({ min: 0, max: 2 })),
            title: 'Story ' + ++counter,
            description: faker.random.words(20),
            points: faker.datatype.float({
              min: 1,
              max: Math.min(sprint.velocity - total_points, 20),
              precision: 0.5,
            }),
            businessValue: +faker.datatype.number({ min: 1, max: 10 }),
            projectId: sprint.projectId,
            sprintId: sprint.id,
            acceptanceCriteria: faker.random.words(10),
            acceptanceTest: boolRand(0.6),
          },
        });
        total_points += userStory.points;
        await createTasks(userStory, sprint, false);
      }
    }

    // Create user stories with no sprint assigned
    for (let z = 0; z < 10; z++) {
      await prisma.userStory.create({
        data: {
          priority: getPriority(+faker.datatype.number({ min: 0, max: 3 })),
          title: 'Story ' + ++counter,
          description: faker.random.words(20),
          points: faker.datatype.float({ min: 1, max: 20, precision: 0.5 }),
          businessValue: +faker.datatype.number({ min: 1, max: 10 }),
          projectId: project.id,
          acceptanceCriteria: faker.random.words(10),
          acceptanceTest: false,
        },
      });
      await prisma.userStory.create({
        data: {
          priority: getPriority(+faker.datatype.number({ min: 0, max: 3 })),
          title: 'Story ' + ++counter,
          description: faker.random.words(20),
          businessValue: +faker.datatype.number({ min: 1, max: 10 }),
          projectId: project.id,
          acceptanceCriteria: faker.random.words(10),
          acceptanceTest: false,
        },
      });
    }

    const project2 = await prisma.project.findUnique({
      where: { id: project.id },
      include: { developers: true },
    });
    const users = [
      ...project2?.developers.map((d) => d.userId),
      project2?.projectOwnerId,
      project2?.scrumMasterId,
    ];
    for (let story = 0; story < 20; story++) {
      await prisma.post.create({
        data: {
          userId:
            users[faker.datatype.number({ min: 0, max: users.length - 1 })],
          message: faker.lorem.paragraphs(4),
          projectId: project.id,
        },
      });
    }
  }

  console.log('Seeding finished.');
}

async function createTask(userStory: UserStory, sprint: Sprint, done: boolean) {
  const project = await prisma.project.findFirst({
    where: { id: sprint.projectId },
    include: {
      developers: {
        include: { user: { select: { id: true } } },
      },
    },
  });
  const userId =
    project.developers[
      faker.datatype.number({ min: 0, max: project.developers.length - 1 })
    ]?.user?.id;
  const task = await prisma.task.create({
    data: {
      userId,
      userStoryId: userStory.id,
      title: faker.random.words(5),
      description: faker.random.words(25),
      sprintId: sprint.id,
      estimate: faker.datatype.float({ min: 4, max: 15, precision: 0.1 }),
      status: done
        ? TaskStatus.FINISHED
        : !userId || !userStory.sprintId
        ? TaskStatus.UNASSIGNED
        : boolRand(0.33)
        ? TaskStatus.ACCEPTED
        : TaskStatus.ASSIGNED,
    },
  });
  if (
    task.status === TaskStatus.ACCEPTED ||
    task.status === TaskStatus.FINISHED
  ) {
    await createTimeLogs(sprint, userId, task, done);
  }
}

async function createTimeLogs(
  sprint: Sprint,
  userId: number,
  task: Task,
  done: boolean
) {
  for (let i = 0; i < faker.datatype.number({ min: 2, max: 5 }); i++) {
    await prisma.timeLog.create({
      data: {
        title: faker.random.words(faker.datatype.number({ min: 1, max: 5 })),
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

  if (done) {
    await prisma.timeLog.create({
      data: {
        title: faker.random.words(faker.datatype.number({ min: 1, max: 5 })),
        day: sprint.end,
        hours: faker.datatype.float({ min: 1, max: 4, precision: 0.1 }),
        userId,
        remainingHours: 0,
        taskId: task.id,
      },
    });
  }
}

async function createTasks(
  userStory: UserStory,
  sprint: Sprint,
  done: boolean
) {
  for (let i = 0; i < faker.datatype.number({ min: 3, max: 6 }); i++) {
    await createTask(userStory, sprint, done ?? boolRand(0.2));
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
