import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { UserNoIdDto } from './dto/userNoId';
import { UserResDto } from './dto/userRes.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  getUserById(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail(id).catch(() => {
      throw new NotFoundException();
    });
  }

  async getUserByIdNoPass(id: number): Promise<UserResDto> {
    const user = await this.getUserById(id);
    delete user['password'];
    return user;
  }

  getUserByEmail(email: string): Promise<User> {
    return this.usersRepository
      .findOneOrFail({
        where: { email },
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  createUser(userData: UserNoIdDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser).catch((err) => {
      if (err.code === '23505') throw new ConflictException();
      throw new BadRequestException();
    });
  }

  async updateUserPassword(id: number, pass: string): Promise<UserResDto> {
    if (pass) {
      const user = await this.getUserById(id);
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(pass, salt);
      const result = await this.usersRepository.save(user);
      delete result['password'];
      return result;
    }
    throw new BadRequestException();
  }
}
