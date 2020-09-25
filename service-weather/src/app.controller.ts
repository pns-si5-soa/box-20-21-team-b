import {Controller, Get, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';

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

  @Post('/poll/mission/go')
  answerToMissionGo(@Res() res: Response): void{
    this.appService.sendAnswerToMission(true).subscribe((val) => console.log(val.data))
    res.status(HttpStatus.OK).send('Response go to mission has been sent');
  }

  @Post('/poll/mission/no-go')
  answerToMissionNoGo(@Res() res: Response): void{
    this.appService.sendAnswerToMission(false).subscribe((val) => console.log(val.data))
    res.status(HttpStatus.OK).send('Response no go to mission has been sent');
  }

}

