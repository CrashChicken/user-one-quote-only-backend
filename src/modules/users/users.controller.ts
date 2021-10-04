import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResDto } from './dto/userRes.dto';
import { UserPasswordDto } from './dto/userPassword.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req): Promise<UserResDto> {
    return this.usersService.getUserByIdNoPass(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/update-password')
  getMyQuote(
    @Request() req,
    @Body() body: UserPasswordDto,
  ): Promise<UserResDto> {
    return this.usersService.updateUserPassword(req.user.userId, body.password);
  }
}
