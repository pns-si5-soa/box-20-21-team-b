import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL_RESPONSE, TOPIC_LAUNCH_EVENT, TOPIC_ROCKET_EVENT} from "../topics";
import {PollService} from "../../poll/poll.service";
import {DataService} from "../../data/data.service";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly pollService: PollService, private readonly dataService: DataService) {
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
    async launchEventsSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_LAUNCH_EVENT + '] ' + payload);
        const body = JSON.parse(payload).body;
        await this.dataService.saveRocketEvent(body.value, body.timestamp);
    }

    @SubscribeTo(TOPIC_ROCKET_EVENT)
    async rocketEventsSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_ROCKET_EVENT + '] ' + payload);
        const body = JSON.parse(payload);
        await this.dataService.saveRocketEvent(body.description, body.timestamp);
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
