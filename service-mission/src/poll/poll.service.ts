import {HttpService, Injectable, Logger} from '@nestjs/common';
import {KafkaService} from "./kafka/kafka.service";
import {TOPIC_POLL, TOPIC_LAUNCH_ORDER} from "./kafka/topics";

@Injectable()
export class PollService {
    private static isPolling = false; //static is used to persist polling across injection from kafka consummer
    private static weatherOk = false;
    private static rocketOk = false;

    constructor(private httpService: HttpService, private readonly kafkaService: KafkaService) {
    }

    public async launchPoll(): Promise<string> {
        if (!PollService.isPolling) {
            PollService.isPolling = true;
            Logger.log('Polling : ' + PollService.isPolling);
            await this.kafkaService.sendMessage(TOPIC_POLL, {
                messageId: '' + new Date().valueOf(),
                body: {
                    value: 'launch_poll'
                },
                messageType: 'info',
                topicName: TOPIC_POLL
            });
            return 'Launching poll: Sending poll to weather';
        } else {
            return 'Poll already in progress !';
        }
    }

    public managePollResponse(payload: any){
        Logger.log('[POLL_SERVICE] Received : ' + payload.body.value);
        if(!PollService.isPolling)
            return;

        if(payload.body.client === 'weather')
            this.progressPollWeather(payload.body.value);

        if(payload.body.client === 'rocket')
            this.progressPollRocket(payload.body.value);

        if(PollService.weatherOk && PollService.rocketOk){
            Logger.log('Everyone is ready you can send the go to rocket')
        }
    }

    private progressPollWeather(response: boolean): void {
        if(response){
            PollService.weatherOk = true;
            Logger.log('Weather is ready!');
        }else if(!response){
            Logger.log('Weather is not ready! Resetting poll state.');
            this.resetPoll();
        }
    }

    private progressPollRocket(response: boolean): void {
        if(response){
            PollService.rocketOk = true;
            Logger.log('Rocket is ready!');
        }else if(!response){
            Logger.log('Rocket is not ready! Resetting poll state.');
            this.resetPoll();
        }
    }

    public async finalizePoll(ready: boolean): Promise<string> {
        if (ready) {
            if (this.isReady()) {
                await this.sendLaunchRequest();
                this.resetPoll();
                return 'Everyone is now ready! Sending go to rocket chief.';
            } else {
                return 'Rocket ready : ' + PollService.rocketOk + ' - weather ready : ' + PollService.weatherOk;
            }
        } else {
            PollService.isPolling = false;
            return 'Mission is not ready! Resetting poll state';
        }
    }

    private async sendLaunchRequest(): Promise<void> {
        await this.kafkaService.sendMessage(TOPIC_LAUNCH_ORDER, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'allow_launch'
            },
            messageType: 'info',
            topicName: TOPIC_POLL
        });
    }

    private isReady(): boolean{
        return PollService.isPolling && PollService.weatherOk && PollService.rocketOk;
    }

    private resetPoll(): void{
        PollService.isPolling = false;
        PollService.weatherOk = false;
        PollService.rocketOk = false;
    }
}
