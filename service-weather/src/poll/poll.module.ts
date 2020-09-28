import {HttpModule, Module} from '@nestjs/common';
import { PollService } from './poll.service';
import {PollController} from "./poll.controller";

@Module({
  imports: [HttpModule, PollModule],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
