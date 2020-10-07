import { HttpModule, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MONGO_DB, MONGO_HOST, MONGO_PORT } from "./env_variables";
import { MongooseModule } from "@nestjs/mongoose";
import { DataModule } from './data/data.module';

@Module({
  imports: [HttpModule, MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB), DataModule],
  providers: [AppService],
})
export class AppModule { }
