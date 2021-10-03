import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from '../../entities/quote.entity';
import { User } from '../../entities/user.entity';
import { Vote } from '../../entities/vote.entity';
import { UsersModule } from '../users/users.module';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Quote, Vote])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
