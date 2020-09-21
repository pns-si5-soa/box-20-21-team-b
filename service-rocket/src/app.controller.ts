import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/status')
  getRocketStatus(): string {
    return "Ready";
  }

  @Post('/poll')
  Polling(): void {
    console.log("Polling in rocket service, answering to mission");
    this.appService.sendAnswerToMission().subscribe((val) => console.log(val));
  }

  @Post('/requestLaunch')
  launching(): void {
    console.log("Launching rocket...");
  }
}
