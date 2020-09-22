import {Controller, Get, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'

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

  @Post('/poll/mission')
  answerToMission(@Res() res: Response): void{
    this.appService.sendAnswerToMission().subscribe((val) => console.log(val.data))
    res.status(HttpStatus.OK).send('Response to mission has been sent');
  }

  @Post('/requestLaunch')
  launching(@Res() res: Response): void {
    Logger.log('Launching the rocket!!');
    res.status(HttpStatus.OK).send('Ok');
  }
}
