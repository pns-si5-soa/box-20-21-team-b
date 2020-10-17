import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {PollService} from "../../poll/poll.service";
import {DataModule} from "../../data/data.module";
import {DataService} from "../../data/data.service";
import {MongooseModule} from "@nestjs/mongoose";
import {LaunchProcessSchema} from "../../model/launchprocess.model";

@Module({
  imports: [HttpModule, DataModule, MongooseModule.forFeature([{ name: 'LaunchProcess', schema: LaunchProcessSchema }]),],
  providers: [ConsumerService, PollService, DataService],
})
export class ConsumerModule {}
