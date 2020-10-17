import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {PollService} from "../../poll/poll.service";
import {DataModule} from "../../data/data.module";
import {DataService} from "../../data/data.service";
import {MongooseModule} from "@nestjs/mongoose";
import {RocketEventSchema} from "../../model/rocketevents.model";

@Module({
  imports: [HttpModule, DataModule, MongooseModule.forFeature([{ name: 'LaunchProcess', schema: RocketEventSchema }]),],
  providers: [ConsumerService, PollService, DataService],
})
export class ConsumerModule {}
