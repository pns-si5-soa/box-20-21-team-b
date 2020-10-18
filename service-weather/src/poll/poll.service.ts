import {Injectable, Logger} from '@nestjs/common';
import {KafkaService} from '../kafka/kafka.service';
import {TOPIC_POLL_RESPONSE} from '../kafka/topics';

@Injectable()
export class PollService {

    constructor(private readonly kafkaService: KafkaService) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public pollInitiated(payload: any){
        Logger.log('Le poll a démarré, merci d\'envoyer une réponse!');
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
