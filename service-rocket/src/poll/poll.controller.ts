import {Body, Controller, Logger, Post} from '@nestjs/common';
import {PollService} from "./poll.service";
import {PollDTO} from "./poll.dto";

@Controller('rocket/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('/initiate')
    initPoll(): string {
        Logger.log('Mission has started a launch poll, please send a response');
        return 'Waiting for rocket response...';
    }

    @Post('/respond')
    answerToMissionGo(@Body() message: PollDTO): string {
        this.pollService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
        return 'Response go {' + message.ready + '} to mission has been sent';
    }
}
