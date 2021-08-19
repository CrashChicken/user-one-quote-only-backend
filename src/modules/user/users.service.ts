import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserNoIdDto } from './dto/userNoId';
import { UserNoPasswordDto } from './dto/userNoPassword.dto';

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

  async getUserByIdNoPass(id: number): Promise<UserNoPasswordDto> {
    const user = await this.getUserById(id);
    delete user['password'];
    return user;
  }

  getUserByUsername(username: string): Promise<User> {
    return this.usersRepository
      .findOneOrFail({
        where: { username: username },
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

  async updateUserPassword(
    id: number,
    pass: string,
  ): Promise<UserNoPasswordDto> {
    if (pass) {
      const user = await this.getUserById(id);
      user.password = pass;
      const result = await this.usersRepository.save(user);
      delete result['password'];
      return result;
    }
    throw new BadRequestException();
  }
}
