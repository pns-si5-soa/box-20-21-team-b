import { Controller, Get } from '@nestjs/common';

@Controller('/telemetry')
export class AppController {

    @Get('/ok')
    healthCheck(): string {
        return 'ok';
    }
}


