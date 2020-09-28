import {Controller, Get, HttpStatus, Logger, Post, Res, Body} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'
import { PollDTO } from './poll.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/status')
  getRocketStatus(): string {
    return "Ready";
  }

  @Post('/poll')
  initPoll(@Res() res: Response): void {
    Logger.log('Mission has started a launch poll, please send a response');
    res.status(HttpStatus.OK).send('Waiting for rocket response...');
  }

  @Post('/poll/answer-mission')
  answerToMissionGo(@Body() message: PollDTO, @Res() res: Response): void{
    this.appService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
    res.status(HttpStatus.OK).send('Response go {' + message.ready + '} to mission has been sent');
  }

  @Post('/request-launch')
  launching(@Res() res: Response): void {
    Logger.log('Launching the rocket!!');
    res.status(HttpStatus.OK).send('Ok');
  }
}
