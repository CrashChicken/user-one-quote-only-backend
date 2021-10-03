import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator';

export class RegisterReqDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @Length(1, 60)
  firstName: string;

  @Length(1, 60)
  lastName: string;
}
