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
    if (user && user.password === pass) {
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

  postRegister(body: RegisterDto): Promise<User> {
    const newUser = this.usersRepository.create(body);
    return this.usersRepository.save(newUser).catch((err) => {
      if (err.code === '23505') throw new ConflictException();
      throw new BadRequestException();
    });
  }
}
