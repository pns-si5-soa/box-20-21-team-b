import {Body, Controller, Get, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {AppService} from './app.service';
import {ThrustersSpeedPayloadDto} from "./dto/ThrustersSpeedPayloadDTO.dto";
import {RocketModuleDto} from './dto/RocketModuleDTO.dto'
import {RocketDto} from "./dto/RocketDTO.dto";

@Controller('rocket')
export class AppController {

    constructor(private readonly appService: AppService) {
    }

    @Get('/ok')
    ok(): string {
        return "ok";
    }

    @Get('/status')
    async getRocketStatus(): Promise<string> {
        return await this.appService.getStatus();
    }

    @Post('/launch')
    async launching(@Body() message: RocketDto): Promise<string> {
        return await this.appService.requestLaunch(message.rocketId);
    }

    @Post('/actions/boom')
    boomStage(@Res() res: Response, @Body() message: RocketModuleDto): void{
        this.appService.boom(res, message.rocketId, message.moduleId);
    }

    @Post('/actions/detach')
    detachModuleBooster(@Res() res: Response, @Body() message: RocketModuleDto): void{
        this.appService.detachModule(res, message.rocketId, message.moduleId);
    }

    @Post('/actions/set-thrusters-speed')
    setThrustersSpeed(@Body() message: ThrustersSpeedPayloadDto, @Res() res: Response): void{
        this.appService.setThrustersSpeed(message.value, res, message.rocketId, message.moduleId);
    }

    @Post('/actions/ok')
    okActions(@Res() res: Response, @Body() message: RocketModuleDto): void{
        this.appService.okActions(res, message.rocketId, message.moduleId);
    }

    @Post('/actions/toggle-running')
    toggleRunning(@Res() res: Response, @Body() message: RocketModuleDto): void{
        this.appService.toggleRunning(res, message.rocketId, message.moduleId);
    }
}
