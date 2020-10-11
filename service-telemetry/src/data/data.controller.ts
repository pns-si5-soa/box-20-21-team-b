import { Controller, Get, Param } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('telemetry')
export class DataController {
    constructor(private readonly dataService: DataService) { }

    /**
     * @param params
     * beginDate: yyyy-mm-ddThh:ii
     * endDate: yyyy-mm-ddThh:ii
     * example -> http://localhost:3004/rocket-metrics/2020-10-07T11:35/2020-10-07T11:36
     */
    @Get('/rocket-metrics/:beginDate/:endDate')
    async getRocketMetrics(@Param() params) {
        let beginDate = params.beginDate;
        if (beginDate === null || beginDate === 'null') {
            beginDate = new Date();
            beginDate.setMinutes(beginDate.getMinutes() - 3); //if no hour given, get current time and remove trhee minutes
            beginDate = beginDate.getTime();
        } else {
            beginDate = Date.parse(beginDate + '+02:00');
        }
        let endDate = params.endDate;
        if (endDate === null || endDate === 'null') {
            endDate = new Date();
            endDate.setMinutes(endDate.getMinutes() + 1); //if no hour given, get current time and add one minute
            endDate = endDate.getTime();
        } else {
            endDate = Date.parse(endDate + '+02:00');
        }
        return await this.dataService.retrieveRocketMetrics(beginDate, endDate);
    }
}
