import {Body, Controller, Get, Post} from '@nestjs/common';
import {AppService} from './app.service';
import {AltitudePayloadDTODto} from "./dto/AltitudePayloadDTO.dto";
import {ThrustersSpeedPayloadDTODto} from "./dto/ThrustersSpeedPayloadDTO.dto";

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
        return this.appService.requestLaunch();
    }

    @Post('/allow-launch')
    allowLaunch(): string{
        return this.appService.allowLaunch();
    }

    @Post('/detach-stage')
    detachFuelPart(): string{
        return this.appService.detachFuelPart();
    }

    @Post('/detach-payload')
    detachPayloadPart(): string{
        return this.appService.detachPayloadPart();
    }

    @Post('/detach-payload/altitude')
    setPayloadAltitudeToDetach(@Body() message: AltitudePayloadDTODto): string{
        return this.appService.setPayloadAltitudeToDetach(message.altitude);
    }

    @Post('/actions/boom')
    boom(): string{
        return this.appService.boom();
    }

    @Post('/actions/detach-module')
    detachModule(): string{
        return this.appService.detachModule();
    }

    @Post('/actions/set-thrusters-speed')
    setThrustersSpeed(@Body() message: ThrustersSpeedPayloadDTODto): string{
        return this.appService.setThrustersSpeed(message.value)
    }
}
