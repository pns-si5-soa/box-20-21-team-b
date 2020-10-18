<<<<<<< HEAD
import {Controller, Get} from "@nestjs/common";

@Controller('mission')
=======
import { Controller, Get } from '@nestjs/common';

<<<<<<<< HEAD:service-mission/src/app.controller.ts
@Controller("/mission")
export class AppController {
    @Get('/ok')
    ok(): string {
        return "ok";
========
@Controller('/telemetry')
>>>>>>> prometheus
export class AppController {

    @Get('/ok')
    healthCheck(): string {
        return 'ok';
<<<<<<< HEAD
    }
}
=======
>>>>>>>> prometheus:service-telemetry/src/app.controller.ts
    }
}


>>>>>>> prometheus
