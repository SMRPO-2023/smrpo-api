export class Token {
  userId: number;
  role: string;
  accessToken: string;
  refreshToken: string;
  lastLogin?: Date;
}
