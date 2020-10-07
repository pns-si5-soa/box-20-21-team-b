import {Controller, Get, Param} from '@nestjs/common';
import { AppService } from './app.service';

@Controller('telemetry-sender')
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * @param params
   * beginDate: yyyy-mm-ddThh:ii
   * endDate: yyyy-mm-ddThh:ii
   * example -> http://localhost:3004/rocket-metrics/2020-10-07T11:35/2020-10-07T11:36
   */
  @Get('/rocket-metrics/:beginDate/:endDate')
  async getRocketMetrics(@Param() params) {
    let beginDate = params.beginDate;
    if(beginDate === null || beginDate === 'null') {
      beginDate = new Date();
      beginDate.setHours(beginDate.getHours() - 1); //if no hour given, get current time and remove one hour
      beginDate = beginDate.getTime();
    }else{
      beginDate = Date.parse(beginDate + '+02:00');
    }
    let endDate = params.endDate;
    if(endDate === null || endDate === 'null') {
      endDate = new Date();
      endDate.setHours(endDate.getHours() + 1); //if no hour given, get current time and add one hour
      endDate = endDate.getTime();
    }else{
      endDate = Date.parse(endDate + '+02:00');
    }
    return await this.appService.retrieveRocketMetrics(beginDate, endDate);
  }
}


