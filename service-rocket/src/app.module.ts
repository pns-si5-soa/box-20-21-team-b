import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from "./env_variables";

@Module({
  // imports: [MongooseModule.forRoot('mongodb://' + MONGO_HOST+ ':' + MONGO_PORT +'/' + MONGO_DB)],
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
