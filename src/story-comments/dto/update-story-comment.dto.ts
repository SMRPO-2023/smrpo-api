import { PartialType } from '@nestjs/swagger';
import { CreateStoryCommentDto } from './create-story-comment.dto';

export class UpdateStoryCommentDto extends PartialType(CreateStoryCommentDto) {}
