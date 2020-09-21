import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ROCKET_HOST, ROCKET_PORT, WEATHER_HOST, WEATHER_PORT } from './env_variables';

@Injectable()
export class AppService {

  private polling: Number = 0;

  constructor(private httpService: HttpService) {}

  launchPoll(): string {
    if (this.polling == 0) {
      this.polling = 1;
      this.sendPollToWeather();
      return 'Launching poll: Sending poll to weather';
    } else {
      return 'Poll not in progress !';
    }
  }

  progressPollWeather(): string {
    if (this.polling == 1) {
      this.polling = 2;
      this.sendPollToRocket();
      return 'Weather is ready!\nPolling rocket service...';
    } else {
      return 'Poll not in progress !';
    }
  }

  progressPollRocket(): string {
    if(this.polling == 2){
      this.polling = 3;
      return 'Rocket is ready!\nPolling mission service...!';
    } else {
      return 'Poll not in progress !';
    }
  }

  finalizePoll(): string {
    if(this.polling == 3){
      this.polling = 4;
      return 'Mission is now ready!';
    } else {
      return 'Poll not in progress !';
    }
  }

  sendPollToWeather(): void {
    this.httpService.post('http://'+WEATHER_HOST+':'+WEATHER_PORT+'/poll');
  }

  sendPollToRocket(): void {
    this.httpService.post('http://'+ROCKET_HOST+':'+ROCKET_PORT+'/poll');
  }

  isReady(): boolean {
    return this.polling == 4
  }
}
