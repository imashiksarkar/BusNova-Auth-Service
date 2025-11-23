import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Gender } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to signin', async () => {
    const signinPayload: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const response = {
      access_token: 'test-token',
      user: signinPayload,
    };

    const result = await controller.signin(signinPayload);

    expect(result).toEqual(response);
  });

  it('should be able to signup', async () => {
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

    const { email, password, ...user } = signupPayload;

    const response = {
      email,
      password,
      user,
    };

    const result = await controller.signup(signupPayload);

    expect(result).toEqual(response);
  });
});
