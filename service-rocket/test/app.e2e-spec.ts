import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_HOST, MONGO_PORT, MONGO_DB } from 'src/env_variables';
import { KafkaModule } from '../src/kafka/kafka.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,         KafkaModule.register({
        clientId: 'rocket-service',
        brokers: ['kafka:9092'],
        groupId: 'box-b',
    }),],
    })
    .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/rocket/ok')
      .expect(200)
      .expect('ok');
  });
});
