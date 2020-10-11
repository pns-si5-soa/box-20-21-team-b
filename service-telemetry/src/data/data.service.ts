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

    let date = new Date(new Date().getTime() - 10000).toISOString();

    this.httpService.get<RocketMetric[]>(`http://${PROBE_HOST}:${PROBE_PORT}/module-metrics/metrics/${date}`).subscribe(
      (val) => {
        let values = val.data.reverse();
        values.forEach(async (metric) => {
          let metricProbe = new this.rocketMetric(metric);
          await metricProbe.save();
        })
      }
    )

    this.httpService.get<RocketMetric[]>(`http://${BOOSTER_HOST}:${BOOSTER_PORT}/module-metrics/metrics/${date}`).subscribe(
      (val) => {
        let values = val.data.reverse();
        values.forEach(async (metric) => {
          let metricBooster = new this.rocketMetric(metric);
          await metricBooster.save();
        })
      }
    )

    this.httpService.get<RocketMetric[]>(`http://${STAGE_HOST}:${STAGE_PORT}/module-metrics/metrics/${date}`).subscribe(
      (val) => {
        let values = val.data.reverse();
        values.forEach(async (metric) => {
          let metricStage = new this.rocketMetric(metric);
          await metricStage.save();
        })
      }
    )


  }

  async retrieveAllMetrics(): Promise<RocketMetric[]> {
    return await this.rocketMetric.find().exec();
  }

  async retrieveRocketMetrics(beginDate: number, endDate: number): Promise<RocketMetric[]> {
    return await this.rocketMetric.find({
      timestamp: { $gt: beginDate, $lt: endDate },
    }).exec();
  }

}
