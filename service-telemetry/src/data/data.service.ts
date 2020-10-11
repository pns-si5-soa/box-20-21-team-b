import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { RocketMetric } from '../model/rocketmetric.model';

@Injectable()
export class DataService {  
    
    constructor(@InjectModel('RocketMetric') private readonly rocketMetric: Model<RocketMetric>) {

}

async retrieveRocketMetrics(beginDate: number, endDate: number) : Promise<RocketMetric[]>{
  return await this.rocketMetric.find({
    timestamp: { $gt: beginDate, $lt: endDate },
  }).exec();
}}
