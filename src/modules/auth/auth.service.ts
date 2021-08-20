import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserNoIdDto } from '../users/dto/userNoId';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.getUserByUsername(username);

    const isMatch = await bcrypt.compare(pass, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  postLogin(user: User): LoginDto {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async postRegister(body: UserNoIdDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    body.password = await bcrypt.hash(body.password, salt);
    const result = await this.usersService.createUser(body);
    delete result['password'];
    return result;
  }
}
