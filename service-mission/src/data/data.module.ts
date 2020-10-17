import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LaunchProcessSchema } from 'src/model/launchprocess.model';
import { DataController } from './data.controller';
import { DataService } from './data.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'LaunchProcess', schema: LaunchProcessSchema }]),],
  controllers: [DataController],
  providers: [DataService]
})
export class DataModule { }
