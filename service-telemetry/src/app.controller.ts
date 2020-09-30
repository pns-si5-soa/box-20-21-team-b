import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('telemetry')
export class AppController {

  constructor(private readonly appService: AppService) {

  }

  @Get('/contact-rocket')
  initRocketConnection(): string {
    this.appService.initRocketConnection().subscribe((val) => console.log(val))
    return 'Contacting rocket...';
  }
}
