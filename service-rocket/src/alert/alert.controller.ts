import { Controller } from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Body, Res } from '@nestjs/common/decorators/http/route-params.decorator';
import { AlertService } from './alert.service';
import { Response } from 'express'

interface alertLabel {
    alertname: string,
    env: string,
    instance: string,
    job: string,
    severity: string
}

@Controller('rocket/alert')
export class AlertController {

    constructor(private readonly alertService: AlertService) { }

    @Post()
    alerting(@Body() message, @Res() res: Response) {
        let alerts: [] = message.alerts;

        alerts.forEach((alert) => {
            let alerting: alertLabel = alert['labels'];
            let rocketId = alerting.job == 'module-metrics' ? 1 : 2;
            let tmp = alerting.instance.split('-')[2];
            let moduleId = tmp == "booster" ? 1 : tmp == "middle" ? 2 : 3;
            this.alertService.alertHandler(res, alerting.alertname, rocketId, moduleId, alerting.severity);
        })
    }
}
