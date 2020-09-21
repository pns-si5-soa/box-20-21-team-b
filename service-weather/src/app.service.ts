import { Injectable, HttpService } from '@nestjs/common';
import { MISSION_HOST, MISSION_PORT, } from './env_variables';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}


  getTemperature(): string {
    return 'The temperature is currently 38°.';
  }

  getHumidity(): string {
    return 'The humidity is about 52%.';
  }

  sendAnswerToMission(): void {
    this.httpService.post('http://'+MISSION_HOST+':'+MISSION_PORT+'/poll/weather/ready');
  }
}
