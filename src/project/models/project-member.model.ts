import 'reflect-metadata';
import { BaseModel } from 'src/common/models/base.model';

export class ProjectMember extends BaseModel {
  user_id: string;
  project_id: string;
  project_role: any;
}
