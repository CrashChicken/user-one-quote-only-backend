import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { LoginResDto } from './dto/loginRes.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserResDto } from '../users/dto/userRes.dto';
import { RegisterReqDto } from './dto/registerReq.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserResDto | null> {
    const user = await this.usersService.getUserByEmail(email);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  postLogin(user: User): LoginResDto {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async postRegister(body: RegisterReqDto): Promise<UserResDto> {
    const salt = await bcrypt.genSalt();
    body.password = await bcrypt.hash(body.password, salt);
    const { password, ...result } = await this.usersService.createUser(body);
    return result;
  }
}
