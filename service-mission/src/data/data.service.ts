import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { LaunchProcessModel } from '../model/launchprocess.model';

@Injectable()
export class DataService {

  constructor(@InjectModel('LaunchProcess') private readonly launchProcess: Model<LaunchProcessModel>) { }

  public test(){

  }

  async saveLaunchEvent(process: string, timestamp: string){
    const model = this.launchProcess({process, timestamp});
    model.save();
  }

  async retrieveAllLaunchEvents(): Promise<LaunchProcessModel[]> {
    return await this.launchProcess.find().exec();
  }

  async retrieveLaunchEvents(beginDate: number, endDate: number): Promise<LaunchProcessModel[]> {
    return await this.launchProcess.find({
      timestamp: { $gt: beginDate, $lt: endDate },
    }).exec();
  }

}
