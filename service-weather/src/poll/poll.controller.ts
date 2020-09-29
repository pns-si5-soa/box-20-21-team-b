import {Body, Controller, Logger, Post} from '@nestjs/common';
import {PollDTO} from "./poll.dto";
import {PollService} from "./poll.service";

@Controller('weather/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('/')
    initPoll(): string {
        Logger.log('Mission has started a launch poll, please send a response');
        return 'Waiting for weather response...';
    }

    @Post('/answer-mission')
    answerToMissionGo(@Body() message: PollDTO,): string {
        this.pollService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
        return 'Response go {' + message.ready + '} to mission has been sent';
    }
}
