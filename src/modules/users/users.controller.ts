import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserResponseDto } from './dto/userResponse.dto';
import { UserPasswordDto } from './dto/userPasswrod.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req): Promise<UserResponseDto> {
    return this.usersService.getUserByIdNoPass(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/update-password')
  getMyQuote(
    @Request() req,
    @Body() body: UserPasswordDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUserPassword(req.user.userId, body.password);
  }
}
