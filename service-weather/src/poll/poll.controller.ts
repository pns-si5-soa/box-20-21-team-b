import {Body, Controller, Get, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import {Response} from "express";
import {PollDTO} from "../poll.dto";
import {PollService} from "./poll.service";

@Controller('weather/poll')
export class PollController {

    constructor(private readonly pollService: PollService) { }

    @Post('/')
    initPoll(@Res() res: Response): void {
        Logger.log('Mission has started a launch poll, please send a response');
        res.status(HttpStatus.OK).send('Waiting for weather response...');
    }

    @Post('/answer-mission')
    answerToMissionGo(@Body() message: PollDTO, @Res() res: Response): void{
        this.pollService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
        res.status(HttpStatus.OK).send('Response go {' + message.ready + '} to mission has been sent');
    }
}
