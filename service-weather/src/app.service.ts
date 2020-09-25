import {Injectable, HttpService} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MISSION_HOST, MISSION_PORT, } from './env_variables';


@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }


  getTemperature(): string {
    return 'The temperature is currently 38°.';
  }

  getHumidity(): string {
    return 'The humidity is about 52%.';
  }

  sendAnswerToMission(go: boolean): Observable<any> {
    return this.httpService.post('http://' + MISSION_HOST + ':' + MISSION_PORT + '/poll/weather', { ready: go });
  }
}
