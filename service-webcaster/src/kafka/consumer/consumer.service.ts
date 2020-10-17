import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_LAUNCH_EVENT, TOPIC_ROCKET_EVENT} from "../topics";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor() {
        super();
    }

    protected registerTopic() {
        this.addTopic(TOPIC_LAUNCH_EVENT);
        this.addTopic(TOPIC_ROCKET_EVENT);
    }


    @SubscribeTo(TOPIC_LAUNCH_EVENT)
    async launchEventsSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_LAUNCH_EVENT + '] ' + payload);
    }

    @SubscribeTo(TOPIC_ROCKET_EVENT)
    async rocketEventsSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_ROCKET_EVENT + '] ' + payload);
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
