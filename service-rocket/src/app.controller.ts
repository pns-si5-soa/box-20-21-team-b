import {Controller, Get, Logger, Post} from '@nestjs/common';
import {AppService} from './app.service';

@Controller('rocket')
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get('/status')
    getRocketStatus(): string {
        return this.appService.getStatus();
    }

    @Post('/request-launch')
    launching(): string {
        Logger.log('Launching the rocket!!');
        return this.appService.requestLaunch();
    }
}
