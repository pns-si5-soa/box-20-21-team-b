import {Module} from '@nestjs/common';
import {PollController} from './poll.controller';
import {PollService} from "./poll.service";

@Module({
    controllers: [PollController],
    imports: [],
    providers: [PollService],
})
export class PollModule {
}
