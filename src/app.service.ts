import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello to SMRPO api ' + process.env.npm_package_version;
  }
}
