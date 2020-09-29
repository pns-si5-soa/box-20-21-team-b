import {Body, Controller, Post} from '@nestjs/common';
import {PollService} from "./poll.service";
import {PollDTO} from "./poll.dto";

@Controller('mission/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('launch')
    launchPoll(): string {
        return this.pollService.launchPoll();
    }

    @Post('weather')
    progressPollWeather(@Body() message: PollDTO): string {
        return this.pollService.progressPollWeather(message.ready);
    }

    @Post('rocket')
    progressPollRocket(@Body() message: PollDTO): string {
        return this.pollService.progressPollRocket(message.ready);
    }

    @Post('mission')
    finalizePoll(@Body() message: PollDTO): string {
        return this.pollService.finalizePoll(message.ready);
    }
}
