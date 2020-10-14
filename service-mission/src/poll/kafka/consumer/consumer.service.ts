import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeToFixedGroup} from '../kafka.decorator';
import {KafkaPayload} from '../kafka.message';
import {TOPIC_POLL} from "../topics";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {
    protected registerTopic() {
        this.addTopic(TOPIC_POLL);
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    // @SubscribeTo('hello.topic')
    // helloSubscriber(payload: KafkaPayload) {
    //     Logger.log('[KAKFA-CONSUMER] Print message after receiving' + payload);
    // }

    /**
     * When application or container scale up &
     * consumer group id is same for application
     * @param payload
     */
    @SubscribeToFixedGroup(TOPIC_POLL)
    helloSubscriberToFixedGroup(payload: KafkaPayload) {
        Logger.log(payload);
    }
}
