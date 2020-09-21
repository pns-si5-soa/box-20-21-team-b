import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/weather')
  getWeather(): string {
    return this.appService.getTemperature() + ' ' + this.appService.getHumidity();
  }

  @Get('/temperature')
  getTemperature(): string {
    return this.appService.getTemperature();
  }

  @Get('/humidity')
  getHumidity(): string {
    return this.appService.getHumidity();
  }
}
