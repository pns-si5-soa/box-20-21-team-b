import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';

@Controller('weather')
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/')
    getWeather(): string {
        return this.appService.getTemperature() + ' ' + this.appService.getHumidity();
    }
}

