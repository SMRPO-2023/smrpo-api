import { IsString } from 'class-validator';

export class ProjectDocumentationDto {
  @IsString()
  documentation?: string;
}
