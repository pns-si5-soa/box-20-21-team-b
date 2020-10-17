import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { RocketEventModel } from '../model/rocketevents.model';

@Injectable()
export class DataService {

  constructor(@InjectModel('LaunchProcess') private readonly launchProcess: Model<RocketEventModel>) { }

  public test(){

  }

  async saveRocketEvent(process: string, timestamp: string){
    const model = this.launchProcess({process, timestamp});
    model.save();
  }

  async retrieveAllRocketEvents(): Promise<RocketEventModel[]> {
    return await this.launchProcess.find().exec();
  }

  async retrieveRocketEvents(beginDate: number, endDate: number): Promise<RocketEventModel[]> {
    return await this.launchProcess.find({
      timestamp: { $gt: beginDate, $lt: endDate },
    }).exec();
  }

}
