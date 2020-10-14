import {Body, Controller, Post} from '@nestjs/common';
import {PollService} from './poll.service';
import {PollDTO} from './poll.dto';

@Controller('mission/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('initiate')
    async launchPoll(): Promise<string> {
        return await this.pollService.launchPoll();
    }

    @Post('mission')
    finalizePoll(@Body() message: PollDTO): string {
        return this.pollService.finalizePoll(message.ready);
    }
}
