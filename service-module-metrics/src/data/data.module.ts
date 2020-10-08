import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { RocketMetricSchema } from './rocketmetric.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'RocketMetric', schema: RocketMetricSchema}])],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule {}
