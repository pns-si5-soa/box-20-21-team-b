import {Body, Controller, Post} from '@nestjs/common';
import {PollService} from './poll.service';
import {PollInitDTO} from "../dto/pollinit.dto";
import {PollDTO} from "../dto/poll.dto";

@Controller('mission/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('initiate')
    async launchPoll(@Body() message: PollInitDTO): Promise<string> {
        return await this.pollService.launchPoll(message.rocketId);
    }

    @Post('mission')
    async finalizePoll(@Body() message: PollDTO): Promise<string> {
        return this.pollService.finalizePoll(message.ready, message.rocketId);
    }
}
