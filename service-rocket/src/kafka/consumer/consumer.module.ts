import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {PollService} from "../../poll/poll.service";
import {AppService} from "../../app.service";

@Module({
  imports: [HttpModule],
  providers: [ConsumerService, PollService, AppService],
})
export class ConsumerModule {}
