import { ArrayMinSize } from 'class-validator';
import { CreateProjectDeveloperDto } from './create-project-developer.dto';

export class CreateProjectDevelopersDto {
  @ArrayMinSize(1)
  developers: CreateProjectDeveloperDto[];
}
