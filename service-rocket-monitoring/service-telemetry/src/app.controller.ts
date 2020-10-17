import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("/telemetry")
export class AppController {
    @Get('/ok')
    ok(): string {
        return "ok";
    }
}


