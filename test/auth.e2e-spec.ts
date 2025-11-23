/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { SignupDto } from '../src/auth/dtos/signup.dto';
import { Gender } from '../src/auth/dtos/create-user.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', async () => {
    const signupPayload: SignupDto = {
      email: 'test@example.com',
      password: 'password123',
      address: '123 Main St',
      firstName: 'John',
      lastName: 'Doe',
      city: 'New York',
      country: 'USA',
      dob: new Date(),
      gender: Gender.male,
      phone: '1234567890',
      state: 'NY',
      zip: '10001',
      avatar: 'http://example.com/avatar.jpg',
    };

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(signupPayload);

    console.log(res.body);
  });
});
