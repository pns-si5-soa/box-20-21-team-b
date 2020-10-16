import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL} from "../topics";
import {PollService} from "../../poll/poll.service";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly pollService: PollService) {
        super();
    }

    protected registerTopic() {
        this.addTopic(TOPIC_POLL);
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo(TOPIC_POLL)
    helloSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_POLL + '] ' + payload);
        this.pollService.pollInitiated(JSON.parse(payload));
    }
}
