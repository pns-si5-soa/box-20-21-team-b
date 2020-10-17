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
    async answerToMissionGo(@Body() message: PollDTO): Promise<string> {
        await this.pollService.sendAnswerToMission(message.ready);
        return 'Response go {' + message.ready + '} to mission has been sent';
    }
}
