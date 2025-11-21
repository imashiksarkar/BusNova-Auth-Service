import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome() {
    return {
      message: 'Welcome to the auth service of BusNova!',
    };
  }

  getHealth() {
    return {
      status: 'OK',
      uptime: process.uptime(),
      message: 'Server is running healthy.',
    };
  }
}
