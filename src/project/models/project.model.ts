import 'reflect-metadata';
import { BaseModel } from 'src/common/models/base.model';

export class Project extends BaseModel {
  title: string;

  documentation: string;
}
