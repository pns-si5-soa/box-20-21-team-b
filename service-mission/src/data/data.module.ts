import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RocketEventSchema } from 'src/model/rocketevents.model';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LaunchProcess', schema: RocketEventSchema }]),],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule { }
