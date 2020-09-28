import {Controller, Get, HttpStatus, Logger, Post, Res, Body} from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';
import { PollDTO } from './poll.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/weather')
  getWeather(): string {
    return this.appService.getTemperature() + ' ' + this.appService.getHumidity();
  }

  @Post('/poll')
  initPoll(@Res() res: Response): void {
    Logger.log('Mission has started a launch poll, please send a response');
    res.status(HttpStatus.OK).send('Waiting for weather response...');
  }

  @Post('/poll/answer-mission')
  answerToMissionGo(@Body() message: PollDTO, @Res() res: Response): void{
    this.appService.sendAnswerToMission(message.ready).subscribe((val) => console.log(val.data))
    res.status(HttpStatus.OK).send('Response go {' + message.ready + '} to mission has been sent');
  }
}

