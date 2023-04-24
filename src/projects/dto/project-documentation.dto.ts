import { IsNotEmpty, IsString } from 'class-validator';

export class ProjectDocumentationDto {
  @IsString()
  @IsNotEmpty()
  documentation: string;
}
