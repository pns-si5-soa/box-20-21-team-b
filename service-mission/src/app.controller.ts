import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'
import { AppService } from './app.service';
import { PollDTO } from './poll.dto';


@Controller()
export class AppController {

  constructor(private readonly appService: AppService) {}

}
