import {HttpService, Injectable, Logger} from '@nestjs/common';
import {Observable} from "rxjs";
import {ROCKET_HOST, ROCKET_PORT, WEATHER_HOST, WEATHER_PORT} from "../env_variables";

@Injectable()
export class PollService {
    private polling = 0;

    constructor(private httpService: HttpService) {
    }

    launchPoll(): string {
        if (this.polling == 0) {
            this.polling = 1;
            this.sendPollToWeather().subscribe((val) => console.log(val.data));
            return 'Launching poll: Sending poll to weather';
        } else {
            return 'Poll already in progress !';
        }
    }

    progressPollWeather(ready: boolean): string {
        if (ready) {
            if (this.polling == 1) {
                this.polling = 2;
                this.sendPollToRocket().subscribe((val) => console.log(val.data));
                Logger.log('Weather is ready! Polling rocket service...');
                return 'Ok';
            } else {
                return 'Poll not in progress !';
            }
        } else {
            this.polling = 0;
            Logger.log('Weather is not ready! Resetting poll state.');
            return 'Not ok';
        }
    }

    progressPollRocket(ready: boolean): string {
        if (ready) {
            if (this.polling == 2) {
                this.polling = 3;
                Logger.log('Rocket is ready! Send the Go to the rocket!');
                return 'Ok';
            } else {
                return 'Poll not in progress !';
            }
        } else {
            this.polling = 0;
            Logger.log('Rocket is not ready! Resetting poll state.');
            return 'Not ok';
        }
    }

    finalizePoll(ready: boolean): string {
        if (ready) {
            if (this.polling == 3) {
                this.polling = 4;
                this.sendLaunchRequest().subscribe((val) => console.log(val.data));
                Logger.log('Everyone is now ready! A launch request has been sent to the rocket service.');
                this.polling = 0;
                return 'Ok';
            } else {
                return 'Poll not in progress !';
            }
        } else {
            this.polling = 0;
            Logger.log('Mission is not ready! Resetting poll state.');
            return 'Not ok';
        }
    }

    sendPollToWeather(): Observable<any> {
        Logger.log('http://' + WEATHER_HOST + ':' + WEATHER_PORT + '/weather/poll/initiate');
        return this.httpService.post('http://' + WEATHER_HOST + ':' + WEATHER_PORT + '/weather/poll/initiate');
    }

    sendPollToRocket(): Observable<any> {
        return this.httpService.post('http://' + ROCKET_HOST + ':' + ROCKET_PORT + '/rocket/poll/initiate');
    }

    sendLaunchRequest(): Observable<any> {
        return this.httpService.post('http://' + ROCKET_HOST + ':' + ROCKET_PORT + '/rocket/launch')
    }

    isReady(): boolean {
        return this.polling == 4
    }
}
