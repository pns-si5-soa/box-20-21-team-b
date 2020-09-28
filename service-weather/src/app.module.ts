import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PollController } from './poll/poll.controller';
import { PollModule } from './poll/poll.module';
import {PollService} from "./poll/poll.service";

@Module({
  imports: [HttpModule, PollModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
