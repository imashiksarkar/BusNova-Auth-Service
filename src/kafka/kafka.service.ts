import { Injectable } from '@nestjs/common';
import { SignupDto } from '../auth/dtos/signup.dto';

@Injectable()
export class KafkaService {
  async PUBLISH_AUTH_CREATED(data: SignupDto) {
    return Promise.resolve(data);
  }
}
