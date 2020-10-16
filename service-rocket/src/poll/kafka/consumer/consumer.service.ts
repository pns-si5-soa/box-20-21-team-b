import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL, TOPIC_LAUNCH_ORDER} from '../topics';
import {PollService} from '../../poll.service';
import {AppService} from "../../../app.service";

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {

    constructor(private readonly pollService: PollService, private readonly appService: AppService) {
        super();
    }

    protected registerTopic() {
        this.addTopic(TOPIC_POLL);
        this.addTopic(TOPIC_LAUNCH_ORDER);
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo(TOPIC_POLL)
    pollSubscriber(payload: string) {
        Logger.log('[KAFKA_' + TOPIC_POLL + '] Received : ' + payload);
        this.pollService.pollInitiated(JSON.parse(payload));
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo(TOPIC_LAUNCH_ORDER)
    allowLaunchSubscriber(payload: string) {
        Logger.log('[KAFKA_ ' + TOPIC_LAUNCH_ORDER + '] Received : ' + payload);
        this.appService.allowLaunch();
    }

    /**
     * When application or container scale up &
     * consumer group id is same for application
     * @param payload
     */
    // @SubscribeToFixedGroup(TOPIC_POLL)
    // pollSubscriber(payload: string) {
    //     Logger.log('[KAFKA_FIXED] Received : ' + payload);
    //     this.pollService.pollInitiated(JSON.parse(payload));
    // }
}
