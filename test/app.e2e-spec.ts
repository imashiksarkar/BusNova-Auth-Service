/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/');

    expect(res.body.message).toMatch(/welcome/gi);
  });

  it('/health (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/health');

    expect(res.body.status).toBe('OK');
    expect(res.body.uptime).toBeDefined();
    expect(res.body.message).toMatch(/healthy/gi);
  });
});
