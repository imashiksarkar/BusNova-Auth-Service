import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbService } from '../db/db.service';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, DbService, KafkaService],
})
export class AuthModule {}
