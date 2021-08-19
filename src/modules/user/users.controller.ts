import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserNoPasswordDto } from './dto/userNoPassword.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req): Promise<UserNoPasswordDto> {
    return this.usersService.getUserByIdNoPass(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/update-password')
  getMyQuote(@Request() req, @Body() body): Promise<UserNoPasswordDto> {
    return this.usersService.updateUserPassword(req.user.userId, body.password);
  }
}
