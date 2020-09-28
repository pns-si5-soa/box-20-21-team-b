import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';
import { PollDTO } from './poll.dto';


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

  @Post('/poll/launch')
  launchPoll(@Res() res: Response): void {
    res.status(HttpStatus.OK).send(this.appService.launchPoll());
  }

  @Post('/poll/weather')
  progressPollWeather(@Body() message: PollDTO, @Res() res: Response): void {
    res.status(HttpStatus.OK).send(this.appService.progressPollWeather(message.ready));
  }

  @Post('/poll/rocket')
  progressPollRocket(@Body() message: PollDTO, @Res() res: Response): void {
    res.status(HttpStatus.OK).send(this.appService.progressPollRocket(message.ready));
  }

  @Post('/poll/mission')
  finalizePoll(@Body() message: PollDTO, @Res() res:Response): void {
    res.status(HttpStatus.OK).send(this.appService.finalizePoll(message.ready));
  }
}
