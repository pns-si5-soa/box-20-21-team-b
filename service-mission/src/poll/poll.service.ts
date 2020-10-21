import {HttpService, Injectable, Logger} from '@nestjs/common';
import {KafkaService} from "../kafka/kafka.service";
import {TOPIC_POLL, TOPIC_LAUNCH_ORDER} from "../kafka/topics";
import {Poll} from "../model/poll.model";

@Injectable()
export class PollService {
    private static polls = []

    getPollFromRocketId(rocketId: number): Poll{
        for(const poll of PollService.polls){
            if(poll.rocketId === rocketId)
                return poll;
        }
        return null;
    }

    constructor(private httpService: HttpService, private readonly kafkaService: KafkaService) {
    }

    public async launchPoll(rocketId: number): Promise<string> {
        let poll = this.getPollFromRocketId(rocketId)
        if(poll != null && poll.isPolling){
            return 'Poll already in progress for rocket {' + rocketId + '} !';
        }else if(poll == null){
            poll = new Poll(rocketId);
            PollService.polls.push(poll);
        }

        poll.isPolling = true;
        await this.kafkaService.sendMessage(TOPIC_POLL, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'launch_poll',
                rocketId: rocketId
            },
            messageType: 'info',
            topicName: TOPIC_POLL
        });
        return 'Launching poll: Sending poll to everyone to launch rocket {' + rocketId + '}';
    }

    public managePollResponse(client: string, value: boolean, rocketId: number){
        const poll = this.getPollFromRocketId(rocketId);
        if(poll === null){
            Logger.log(client + ' tried to answer the poll but rocket ' + rocketId + ' does not exists')
            return;
        }

        if(client === 'weather')
            this.progressPollWeather(poll, value);

        if(client === 'rocket')
            this.progressPollRocket(poll, value);

        if(this.isReady(poll)){
            Logger.log('Everyone is ready you can send the go to rocket {' + rocketId + '}')
        }
    }

    private progressPollWeather(poll: Poll, response: boolean): void {
        if(response){
            poll.weatherOk = true;
            Logger.log('Weather is ready!');
        }else if(!response){
            Logger.log('Weather is not ready! Resetting poll state.');
            this.resetPoll(poll);
        }
    }

    private progressPollRocket(poll: Poll, response: boolean): void {
        if(response){
            poll.rocketOk = true;
            Logger.log('Rocket is ready!');
        }else if(!response){
            Logger.log('Rocket is not ready! Resetting poll state.');
            this.resetPoll(poll);
        }
    }

    public async finalizePoll(ready: boolean, rocketId: number): Promise<string> {
        const poll = this.getPollFromRocketId(rocketId);

        if (ready) {
            if (this.isReady(poll)) {
                await this.sendLaunchRequest(rocketId);
                this.resetPoll(poll);
                return 'Everyone is now ready! Sending go to rocket chief.';
            } else {
                return 'Rocket ready : ' + poll.rocketOk + ' - weather ready : ' + poll.weatherOk;
            }
        } else {
            this.resetPoll(poll);
            return 'Mission is not ready! Resetting poll state';
        }
    }

    private async sendLaunchRequest(rocketId: number): Promise<void> {
        await this.kafkaService.sendMessage(TOPIC_LAUNCH_ORDER, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'allow_launch',
                rocketId: rocketId
            },
            messageType: 'info',
            topicName: TOPIC_LAUNCH_ORDER
        });
    }

    private isReady(poll: Poll): boolean{
        return poll.isPolling && poll.weatherOk && poll.rocketOk;
    }

    private resetPoll(poll: Poll): void{
        poll.isPolling = false;
        poll.weatherOk = false;
        poll.rocketOk = false;
    }
}
