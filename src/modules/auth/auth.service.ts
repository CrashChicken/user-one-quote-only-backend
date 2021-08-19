import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository
      .findOneOrFail({
        where: { username: username },
      })
      .catch(() => {
        throw new NotFoundException();
      });

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

  async postRegister(body: RegisterDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    body.password = await bcrypt.hash(body.password, salt);
    const newUser = this.usersRepository.create(body);
    const result = await this.usersRepository.save(newUser).catch((err) => {
      if (err.code === '23505') throw new ConflictException();
      throw new BadRequestException();
    });
    delete result['password'];
    return result;
  }
}
