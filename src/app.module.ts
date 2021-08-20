import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import config from '../ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    AuthModule,
    UsersModule,
    QuotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
