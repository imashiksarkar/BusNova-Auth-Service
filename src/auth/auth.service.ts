import { Injectable } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  async signin(payload: SigninDto) {
    return await Promise.resolve({
      access_token: 'test-token',
      user: payload,
    });
  }
}
