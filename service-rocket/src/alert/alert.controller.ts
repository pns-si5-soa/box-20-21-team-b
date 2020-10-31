import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { AlertService } from './alert.service';

@Controller('rocket/alert')
export class AlertController {

    constructor(private readonly AlertService: AlertService) { }

    @Post()
    alerting(@Body() message) {
        console.log(`New alert received`);
        console.log(message);
    }
}
