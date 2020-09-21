import { Injectable, HttpService } from '@nestjs/common';
import { MISSION_HOST, MISSION_PORT, } from './env_variables';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}


  getStatus(): string {
    return 'Rocket is ready to take off !';
  }

  sendAnswerToMission(): void {
    this.httpService.post('http://'+MISSION_HOST+':'+MISSION_PORT+'/poll/rocket/ready');
  }
}
