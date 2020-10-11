import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {AppService} from './app.service';
import {AltitudePayloadDTODto} from "./dto/AltitudePayloadDTO.dto";
import {ThrustersSpeedPayloadDTODto} from "./dto/ThrustersSpeedPayloadDTO.dto";

@Controller('rocket')
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get('/status')
    getRocketStatus(): string {
        return this.appService.getStatus();
    }

    @Post('/launch')
    launching(): string {
        return this.appService.requestLaunch();
    }

    @Post('/allow-launch')
    allowLaunch(): string{
        return this.appService.allowLaunch();
    }

    @Post('/detach-payload/altitude')
    setPayloadAltitudeToDetach(@Body() message: AltitudePayloadDTODto): string{
        return this.appService.setPayloadAltitudeToDetach(message.altitude);
    }

    @Post('/actions/boom/payload')
    boomPayload(@Res() res: Response): void{
        this.appService.boom(res, 'payload');
    }

    @Post('/actions/boom/booster')
    boomBooster(@Res() res: Response): void{
        this.appService.boom(res, 'booster');
    }

    @Post('/actions/boom/stage')
    boomStage(@Res() res: Response): void{
        this.appService.boom(res, 'stage');
    }

    @Post('/actions/detach/payload')
    detachModulePayload(@Res() res: Response): void{
        this.appService.detachModule(res, 'payload');
    }

    @Post('/actions/detach/booster')
    detachModuleBooster(@Res() res: Response): void{
        this.appService.detachModule(res, 'booster');
    }

    @Post('/actions/set-thrusters-speed')
    setThrustersSpeed(@Body() message: ThrustersSpeedPayloadDTODto, @Res() res: Response): void{
        this.appService.setThrustersSpeed(message.value, res);
    }

    @Post('/actions/ok')
    ok(@Res() res: Response): void{
        this.appService.okActions(res);
    }

    @Post('/actions/toggle-running')
    toggleRunning(@Res() res: Response): void{
        this.appService.toggleRunning(res);
    }
}
