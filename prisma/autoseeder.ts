import { PrismaClient, StoryPriority } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function getPriority(i: number) {
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
      email: 'john@simpson.com',
      firstname: 'John',
      lastname: 'Simpson',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      role: 'USER',
      username: 'simpsonj',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      email: 'sara@simpson.com',
      firstname: 'Sara',
      lastname: 'Simpson',
      // cspell:disable-next-line -- disables checking till the end of the next line.
      password: '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
      role: 'USER',
      username: 'simpsons',
    },
  });

  // const projects = [];
  for (let i = 0; i < 4; i++) {
    const users = [];
    for (let i = 0; i < 2; i++) {
      const fn = faker.name.firstName();
      const ln = faker.name.lastName();
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(fn, ln),
          firstname: fn,
          lastname: ln,
          role: +faker.random.numeric() < 3 ? 'ADMIN' : 'USER',
          // cspell:disable-next-line -- disables checking till the end of the next line.
          password:
            '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
          username: faker.internet.userName(ln, fn),
        },
      });
      users.push(user);
    }

    const project = await prisma.project.create({
      data: {
        title: faker.random.words(2),
        documentation: faker.random.words(100),
        projectOwnerId: users[0].id,
        scrumMasterId: users[1].id,
      },
    });
    // projects.push(project);
    for (let i = 0; i < 20; i++) {
      const fn = faker.name.firstName();
      const ln = faker.name.lastName();
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(fn, ln),
          firstname: fn,
          lastname: ln,
          role: +faker.random.numeric(1) < 3 ? 'ADMIN' : 'USER',
          // cspell:disable-next-line -- disables checking till the end of the next line.
          password:
            '$2b$10$DRzCId0X0guJa7wtynJ0FOrAijm7IY9l2Ora9KygCK4lwH1lSvV12', // secret12345678
          username: faker.internet.userName(ln, fn),
        },
      });
      await prisma.projectDeveloper.create({
        data: {
          userId: user.id,
          projectId: project.id,
        },
      });
    }

    for (let s = 0; s < +faker.datatype.number({ min: 1, max: 8 }); s++) {
      let startdate = faker.date.past();
      const sprint = await prisma.sprint.create({
        data: {
          start: startdate,
          end: faker.date.soon(14, startdate),
          velocity: +faker.datatype.number({ min: 2, max: 15 }),
          projectId: project.id,
          name: `sprint ${s}`,
        },
      });
      startdate = faker.date.past(0, startdate);

      for (let us = 0; us < 10; us++) {
        let sprintRelation = {};
        if (+faker.datatype.number({ min: 1, max: 3 }) < 2) {
          sprintRelation = {
            Sprint: { connect: { id: sprint.id } },
          };
        }

        const story = await prisma.userStory.create({
          data: {
            ...sprintRelation,
            priority: getPriority(+faker.random.numeric() % 4),
            title: faker.random.words(4),
            description: faker.random.words(40),
            acceptanceCriteria: faker.random.words(40),
            points: +faker.datatype.number({ min: 4, max: 15 }),
            businessValue: +faker.datatype.number({ min: 1, max: 7 }),
            project: { connect: { id: project.id } },
            accepted:
              +faker.datatype.number({ min: 1, max: 5 }) < 3 ? true : false,
          },
        });

        // for (let ac = 0; ac < 3; ac++) {
        //   await prisma.acceptanceCriteria.create({
        //     data: {
        //       userStoryId: story.id,
        //       title: faker.random.words(4),
        //       description: faker.random.words(20),
        //       completed:
        //         +faker.datatype.number({ min: 1, max: 5 }) < 4 ? true : false,
        //     },
        //   });
        // }
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
