import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL_RESPONSE} from "../topics";
import {PollService} from "../../poll.service";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly pollService: PollService) {
        super();
    }

    protected registerTopic() {
        this.addTopic(TOPIC_POLL_RESPONSE);
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo(TOPIC_POLL_RESPONSE)
    helloSubscriber(payload: string) {
        Logger.log('[KAFKA] Received : ' + payload);
        this.pollService.managePollResponse(JSON.parse(payload));
    }

    /**
     * When application or container scale up &
     * consumer group id is same for application
     * @param payload
     */
    // @SubscribeToFixedGroup(TOPIC_POLL_RESPONSE)
    // pollSubscriber(payload: string) {
    //     Logger.log('[KAFKA_FIXED] Received : ' + payload);
    //     this.pollService.managePollResponse(JSON.parse(payload));
    // }
}