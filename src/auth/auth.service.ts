import { BadRequestException, Injectable } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { DbService } from '../db/db.service';

@Injectable()
export class AuthService {
  constructor(private readonly db: DbService) {}

  async signin(payload: SigninDto) {
    const user = await this.db.auth.findUnique({
      where: { email: payload.email },
    });

    if (!user) throw new BadRequestException('Invalid credentials');

    if (user.password !== payload.password)
      throw new BadRequestException('Invalid credentials');

    return user;
  }

  async signup(payload: SignupDto) {
    const existingUser = await this.db.auth.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) throw new BadRequestException('User already exists');

    const newUser = await this.db.auth.create({
      data: {
        email: payload.email,
        password: payload.password, // In a real application, make sure to hash the password before storing it
      },
    });

    return newUser;
  }
}
