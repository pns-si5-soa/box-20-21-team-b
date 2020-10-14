import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {PollService} from "../../poll.service";

@Module({
  imports: [HttpModule],
  providers: [ConsumerService, PollService],
})
export class ConsumerModule {}
