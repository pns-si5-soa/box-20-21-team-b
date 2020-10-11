import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common/http/http.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RocketMetricSchema } from 'src/model/rocketmetric.model';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [HttpModule, MongooseModule.forFeature([{ name: 'RocketMetric', schema: RocketMetricSchema }]),],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule { }
