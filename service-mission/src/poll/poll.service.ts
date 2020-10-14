import {HttpService, Injectable, Logger} from '@nestjs/common';
import {Observable} from "rxjs";
import {ROCKET_HOST, ROCKET_PORT, WEATHER_HOST, WEATHER_PORT} from "../env_variables";
import {KafkaService} from "./kafka/kafka.service";
import {TOPIC_POLL} from "./kafka/topics";

@Injectable()
export class PollService {
    private polling = 0;

    constructor(private httpService: HttpService, private readonly kafkaService: KafkaService) {
    }

    launchPoll(): string {
        if (this.polling == 0) {
            this.polling = 1;
            this.sendPollToWeather().subscribe((val) => console.log(val.data));
            this.kafkaService.sendMessage(TOPIC_POLL, {
                messageId: '' + new Date().valueOf(),
                body: {
                    value: 'LAUNCH_POLL'
                },
                messageType: 'info',
                topicName: TOPIC_POLL
            });
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
                return 'Weather is ready! Waiting for rocket service...';
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
                return 'Rocket is ready! Mission will send the Go to the rocket!';
            } else {
                return 'Poll not in progress !';
            }
        } else {
            this.polling = 0;
            return 'Rocket is not ready! Resetting poll state.';
        }
    }

    finalizePoll(ready: boolean): string {
        if (ready) {
            if (this.polling == 3) {
                this.polling = 4;
                this.sendLaunchRequest().subscribe((val) => console.log(val.data));
                this.polling = 0;
                return 'Everyone is now ready! Sending go to rocket chief.';
            } else {
                return 'Poll not in progress !';
            }
        } else {
            this.polling = 0;
            return 'Mission is not ready! Resetting poll state';
        }
    }

    sendPollToWeather(): Observable<any> {
        return this.httpService.post('http://' + WEATHER_HOST + ':' + WEATHER_PORT + '/weather/poll/initiate');
    }

    sendPollToRocket(): Observable<any> {
        return this.httpService.post('http://' + ROCKET_HOST + ':' + ROCKET_PORT + '/rocket/poll/initiate');
    }

    sendLaunchRequest(): Observable<any> {
        return this.httpService.post('http://' + ROCKET_HOST + ':' + ROCKET_PORT + '/rocket/allow-launch')
    }

    isReady(): boolean {
        return this.polling == 4
    }
}
