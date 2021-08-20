import { IsNotEmpty } from 'class-validator';

export class UserPasswordDto {
  @IsNotEmpty()
  password: string;
}
