import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: unknown) {
    return body;
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return await this.authService.signin(body);
  }
}
