import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { DbService } from '../db/db.service';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly roles = ['user', 'admin', 'guide'];

  constructor(
    private readonly db: DbService,
    private readonly kafka: KafkaService,
  ) {}

  async onModuleInit() {
    try {
      const existingRoles = await this.db.role
        .findMany({
          where: { name: { in: this.roles } },
        })
        .then((roles) => roles.map((role) => role.name));

      const newRoles = this.roles.filter(
        (role) => !existingRoles.includes(role),
      );

      if (newRoles.length < 1) return;

      await this.db.role.createMany({
        data: newRoles.map((role) => ({ name: role })),
      });

      console.log('Roles initialized:', newRoles);
    } catch (error) {
      console.error('Error initializing roles:', error);
    }
  }

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
        password: payload.password,
      },
    });

    await this.kafka.PUBLISH_AUTH_CREATED(payload);

    return newUser;
  }
}
