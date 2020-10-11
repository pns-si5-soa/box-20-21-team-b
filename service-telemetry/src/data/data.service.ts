import { HttpService, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose'
import { RocketMetric } from '../model/rocketmetric.model';

@Injectable()
export class DataService {  
    
  constructor(@InjectModel('RocketMetric') private readonly rocketMetric: Model<RocketMetric>, private httpService: HttpService) {}


  //Task done every 10 seconds
  @Cron(CronExpression.EVERY_10_SECONDS, {name: 'metrics'})
  getMetrics(){

  }

  async retrieveRocketMetrics(beginDate: number, endDate: number) : Promise<RocketMetric[]>{
    return await this.rocketMetric.find({
      timestamp: { $gt: beginDate, $lt: endDate },
    }).exec();
  }

}
