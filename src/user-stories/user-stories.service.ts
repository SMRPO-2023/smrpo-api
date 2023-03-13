import { Injectable } from '@nestjs/common';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';

@Injectable()
export class UserStoriesService {
  create(createUserStoryDto: CreateUserStoryDto) {
    return 'This action adds a new userStory';
  }

  findAll() {
    return `This action returns all userStories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userStory`;
  }

  update(id: number, updateUserStoryDto: UpdateUserStoryDto) {
    return `This action updates a #${id} userStory`;
  }

  remove(id: number) {
    return `This action removes a #${id} userStory`;
  }
}
