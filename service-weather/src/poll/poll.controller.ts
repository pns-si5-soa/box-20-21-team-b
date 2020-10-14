import {Body, Controller, Post} from '@nestjs/common';
import {PollDTO} from './poll.dto';
import {PollService} from './poll.service';

@Controller('weather/poll')
export class PollController {

    constructor(private readonly pollService: PollService) {
    }

    @Post('/respond')
    async answerToMissionGo(@Body() message: PollDTO): Promise<string> {
        await this.pollService.sendAnswerToMission(message.ready);
        return 'Response go {' + message.ready + '} to mission has been sent';
    }
}
