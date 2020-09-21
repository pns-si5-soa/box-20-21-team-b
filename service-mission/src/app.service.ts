import { HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { ROCKET_HOST, ROCKET_PORT, WEATHER_HOST, WEATHER_PORT } from './env_variables';

@Injectable()
export class AppService {

  private polling = 0;

  constructor(private httpService: HttpService) {}

  launchPoll(): string {
    if (this.polling == 0) {
      this.polling = 1;
      this.sendPollToWeather();
      return 'Launching poll: Sending poll to weather';
    } else {
      return 'Poll already in progress !';
    }
  }

  progressPollWeather(ready: boolean): string {
    if(ready) {
      if (this.polling == 1) {
        this.polling = 2;
        this.sendPollToRocket();
        return 'Weather is ready!\nPolling rocket service...';
      } else {
        return 'Poll not in progress !';
      }
    } else {
      this.polling = 0;
      return 'Weather is not ready!\nResetting poll state.'
    }
  }

  progressPollRocket(ready: boolean): string {
    if(ready) {
      if(this.polling == 2){
        this.polling = 3;
        return 'Rocket is ready!\nPolling mission service...!';
      } else {
        return 'Poll not in progress !';
      }
    } else {
      this.polling = 0;
      return 'Rocket is not ready!\nResetting poll state.'
    }
  }

  finalizePoll(ready: boolean): string {
    if(ready) {
      if(this.polling == 3){
        this.polling = 4;
        this.sendLaunchRequest();
        return 'Everyone is now ready!\nA launch request has been sent to the rocket service.';
      } else {
        return 'Poll not in progress !';
      }
    } else {
      this.polling = 0;
      return 'Mission is not ready!\nResetting poll state.'
    }
  }

  sendPollToWeather(): void {
    this.httpService.post('http://'+WEATHER_HOST+':'+WEATHER_PORT+'/poll');
  }

  sendPollToRocket(): void {
    this.httpService.post('http://'+ROCKET_HOST+':'+ROCKET_PORT+'/poll');
  }

  sendLaunchRequest(): void {
    this.httpService.post('http://'+ROCKET_HOST+':'+ROCKET_PORT+'/requestLaunch')
  }

  isReady(): boolean {
    return this.polling == 4
  }
}
