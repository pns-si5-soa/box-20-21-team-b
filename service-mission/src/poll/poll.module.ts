import {HttpModule, Module} from '@nestjs/common';
import {PollController} from './poll.controller';
import {PollService} from "./poll.service";

@Module({
    controllers: [PollController],
    imports: [HttpModule],
    providers: [PollService],
})
export class PollModule {
}
