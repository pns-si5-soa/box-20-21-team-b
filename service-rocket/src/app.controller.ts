import {Body, Controller, Get, Logger, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {AltitudePayloadDTODto} from "./dto/AltitudePayloadDTO.dto";

@Controller('rocket')
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get('/status')
    getRocketStatus(): string {
        const status = this.appService.getStatus();
        this.appService.sendStatusToTelemetry(status);
        return status;
    }

    @Post('/launch')
    launching(): string {
        Logger.log('Launching the rocket!!');
        
        return this.appService.requestLaunch();
    }

    @Post('/detach-stage')
    detachFuelPart(): string{
        return this.appService.detachFuelPart();
    }

    @Post('/detach-payload')
    detachPayloadPart(): string{
        return this.appService.detachPayloadPart();
    }

    @Post('/detach-payload')
    setPayloadAltitudeToDetach(@Body() message: AltitudePayloadDTODto): string{
        return this.appService.setPayloadAltitudeToDetach(message.altitude);
    }
}
