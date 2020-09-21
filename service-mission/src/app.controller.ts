import { Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';


@Controller()
export class AppController {

  private polling: Number = 0;

  constructor(private readonly appService: AppService) {}

  private isReady(): Boolean {
    return this.polling == 4;
  }

  @Get()
  getMissionStatus(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(this.appService.getMissionStatus());
  }

  @Post('/poll/launch')
  launchPoll(@Res() res: Response): void {
    if(this.polling === 0) {
      this.polling = 1;
      this.appService.sendPollToWeather();
      res.status(HttpStatus.OK).send('Polling weather service...');
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Poll already in progress !');
    }
  }

  @Post('/poll/weather/ready')
  progressPollWeather(@Res() res: Response): void {
    if(this.polling == 1){
      this.polling = 2;
      this.appService.sendPollToRocket();
      res.status(HttpStatus.OK).send('Weather is ready!\nPolling rocket service...');
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Poll not in progress !');
    }
  }

  @Post('/poll/rocket/ready')
  progressPollRocket(@Res() res: Response): void {
    if(this.polling == 2){
      this.polling = 3;
      res.status(HttpStatus.OK).send('Rocket is ready!\nPolling mission service...!');
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Poll not in progress !');
    }
  }

  @Post('/poll/ready')
  finalizePoll(@Res() res:Response): void {
    if(this.polling == 3){
      this.polling = 4;
      res.status(HttpStatus.OK).send('Mission is now ready!');
    } else {
      res.status(HttpStatus.FORBIDDEN).send('Poll not in progress !');
    }
  }
}
