import {Body, Controller, HttpStatus, Logger, Post, Res} from '@nestjs/common';
import {PollService} from "./poll.service";
import {PollDTO} from "../poll.dto";
import {Response} from "express"; // TODO fix Response from express

@Controller('mission/poll')
export class PollController {

    constructor(private readonly pollService: PollService) { }

    @Post('launch')
    launchPoll(@Res() res: Response): void {
        res.status(HttpStatus.OK).send(this.pollService.launchPoll());
    }

    @Post('weather')
    progressPollWeather(@Body() message: PollDTO, @Res() res: Response): void {
        res.status(HttpStatus.OK).send(this.pollService.progressPollWeather(message.ready));
    }

    @Post('rocket')
    progressPollRocket(@Body() message: PollDTO, @Res() res: Response): void {
        res.status(HttpStatus.OK).send(this.pollService.progressPollRocket(message.ready));
    }

    @Post('mission')
    finalizePoll(@Body() message: PollDTO, @Res() res:Response): void {
        res.status(HttpStatus.OK).send(this.pollService.finalizePoll(message.ready));
    }
}
