import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserResDto } from '../users/dto/userRes.dto';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/loginRes.dto';
import { RegisterReqDto } from './dto/registerReq.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  postLogin(@Request() req): LoginResDto {
    return this.authService.postLogin(req.user);
  }

  @Post('register')
  postRegister(@Body() body: RegisterReqDto): Promise<UserResDto> {
    return this.authService.postRegister(body);
  }
}
