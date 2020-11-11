import {Controller, Get} from "@nestjs/common";

@Controller('mission')
export class AppController {
    @Get('/ok')
    ok(): string {
        return "ok";
    }
}
