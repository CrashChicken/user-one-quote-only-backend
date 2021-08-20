import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quote } from 'src/entities/quote.entity';
import { User } from 'src/entities/user.entity';
import { Vote } from 'src/entities/vote.entity';
import { UsersModule } from '../users/users.module';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User, Quote, Vote])],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
