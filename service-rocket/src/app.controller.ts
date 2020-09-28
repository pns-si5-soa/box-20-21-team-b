import {Controller, Get, HttpStatus, Logger, Post, Res, Body} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express'
import { PollDTO } from './poll.dto';

@Controller('rocket')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/status')
  getRocketStatus(): string {
    return "Ready";
  }

  @Post('/request-launch')
  launching(@Res() res: Response): void {
    Logger.log('Launching the rocket!!');
    res.status(HttpStatus.OK).send('Ok');
  }
}
