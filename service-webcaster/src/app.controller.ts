import {Controller, Get} from "@nestjs/common";

@Controller('webcaster')
export class AppController {

    @Get('/ok')
    healthCheck(): string {
        return 'ok';
    }
}
