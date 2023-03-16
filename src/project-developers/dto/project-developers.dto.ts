import { ArrayMinSize } from 'class-validator';
import { ProjectDeveloperDto } from './project-developer.dto';

export class ProjectDevelopersDto {
  @ArrayMinSize(1)
  developers: ProjectDeveloperDto[];
}
