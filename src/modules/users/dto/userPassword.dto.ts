import { IsNotEmpty, IsString } from 'class-validator';

export class UserPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
