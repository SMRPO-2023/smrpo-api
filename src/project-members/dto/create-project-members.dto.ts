import { ArrayMinSize } from 'class-validator';
import { CreateProjectMemberDto } from './create-project-member.dto';

export class CreateProjectMembersDto {
  @ArrayMinSize(1)
  members: CreateProjectMemberDto[];
}
