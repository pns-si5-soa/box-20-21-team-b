import { Controller, Get } from '@nestjs/common';
import { DataService } from './data.service';

@Controller('telemetry/data')
export class DataController {

    constructor(private readonly dataservice: DataService) { }

    @Get('/rocketmetrics')
    async getRocketMetrics() {
        return await this.dataservice.retrieveRocketMetrics();
    }
}
