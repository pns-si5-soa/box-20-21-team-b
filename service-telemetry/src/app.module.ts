import {HttpModule, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from "./env_variables";
import {MongooseModule} from "@nestjs/mongoose";
import {RocketMetricSchema} from "./model/rocketmetric.model";

@Module({
  imports: [HttpModule, MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB), MongooseModule.forFeature([{name: 'RocketMetric', schema: RocketMetricSchema}])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
