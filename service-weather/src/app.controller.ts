import {Controller, Get, HttpStatus, Logger, Post, Res, Body} from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';
import { PollDTO } from './poll.dto';

@Controller('weather')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/')
  getWeather(): string {
    return this.appService.getTemperature() + ' ' + this.appService.getHumidity();
  }
}

