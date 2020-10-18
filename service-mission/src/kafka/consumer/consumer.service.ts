import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL_RESPONSE, TOPIC_LAUNCH_EVENT, TOPIC_ROCKET_EVENT} from "../topics";
import {PollService} from "../../poll/poll.service";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly pollService: PollService) {
        super();
    }

    protected registerTopic() {
        this.addTopic(TOPIC_POLL_RESPONSE);
        this.addTopic(TOPIC_LAUNCH_EVENT);
        this.addTopic(TOPIC_ROCKET_EVENT);
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo(TOPIC_POLL_RESPONSE)
    pollSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_POLL_RESPONSE + '] ' + payload);
        this.pollService.managePollResponse(JSON.parse(payload));
    }

    @SubscribeTo(TOPIC_LAUNCH_EVENT)
    helloSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_LAUNCH_EVENT + '] ' + payload);
    }

    @SubscribeTo(TOPIC_ROCKET_EVENT)
    rocketEventSubscriber(payload: string) {
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
