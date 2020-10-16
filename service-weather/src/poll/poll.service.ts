import {Injectable, Logger} from '@nestjs/common';
import {KafkaService} from '../kafka/kafka.service';
import {TOPIC_POLL_RESPONSE} from '../kafka/topics';

@Injectable()
export class PollService {

    constructor(private readonly kafkaService: KafkaService) {
    }

    public pollInitiated(payload: any){
        Logger.log('Le poll a démarré');
        Logger.log(payload.body.value);
    }

    async sendAnswerToMission(go: boolean): Promise<void> {
        await this.kafkaService.sendMessage(TOPIC_POLL_RESPONSE, {
            messageId: '' + new Date().valueOf(),
            body: {
                client: 'weather',
                value: go
            },
            messageType: 'info',
            topicName: TOPIC_POLL_RESPONSE
        });
    }
}
