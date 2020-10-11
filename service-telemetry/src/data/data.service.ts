import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose'
import { BOOSTER_HOST, BOOSTER_PORT, PROBE_HOST, PROBE_PORT, STAGE_HOST, STAGE_PORT } from 'src/env_variables';
import { RocketMetric } from '../model/rocketmetric.model';

@Injectable()
export class DataService {

  constructor(@InjectModel('RocketMetric') private readonly rocketMetric: Model<RocketMetric>, private httpService: HttpService) { }


  //Task done every 10 seconds
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'metrics' })
  async getMetrics() {
    Logger.log("Metrics log");
    //Todo remove comments when services are ready
    /*let metricProbe = new this.rocketMetric(this.httpService.get(`${PROBE_HOST}:${PROBE_PORT}/metrics`));
    await metricProbe.save();

    let metricStage = new this.rocketMetric(this.httpService.get(`${STAGE_HOST}:${STAGE_PORT}/metrics`));
    await metricStage.save();

    let metricBooster = new this.rocketMetric(this.httpService.get(`${BOOSTER_HOST}:${BOOSTER_PORT}/metrics`));
    await metricBooster.save();*/
  }

  async retrieveRocketMetrics(beginDate: number, endDate: number): Promise<RocketMetric[]> {
    return await this.rocketMetric.find({
      timestamp: { $gt: beginDate, $lt: endDate },
    }).exec();
  }

}
