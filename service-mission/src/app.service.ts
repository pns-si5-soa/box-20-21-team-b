import { HttpService, Injectable } from '@nestjs/common';
import { ROCKET_HOST, ROCKET_PORT, WEATHER_HOST, WEATHER_PORT } from './env_variables';

@Injectable()
export class AppService {

  constructor(private httpService: HttpService) {}

  sendPollToWeather(): void {
    this.httpService.post('http://'+WEATHER_HOST+':'+WEATHER_PORT+'/poll');
  }

  sendPollToRocket(): void {
    this.httpService.post('http://'+ROCKET_HOST+':'+ROCKET_PORT+'/poll');
  }
}
