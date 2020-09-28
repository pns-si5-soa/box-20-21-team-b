import {Body, Controller, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import {PollService} from "./poll.service";
import {PollDTO} from "../poll.dto";
import {Response} from "express"; // TODO fix Response from express

@Controller('rocket/poll')
export class PollController {

    constructor(private readonly pollService: PollService) { }

    @Post('/poll')
    initPoll(@Res() res: Response): void {
        Logger.log('Mission has started a launch poll, please send a response');
        res.status(HttpStatus.OK).send('Waiting for rocket response...');
    }

    @Post('/poll/answer-mission')
    answerToMissionGo(@Body() message: PollDTO, @Res() res: Response): void{
        this.pollService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
        res.status(HttpStatus.OK).send('Response go {' + message.ready + '} to mission has been sent');
    }
}
