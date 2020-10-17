import {Injectable, Logger} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {TOPIC_POLL, TOPIC_LAUNCH_ORDER} from '../topics';
import {PollService} from '../../poll/poll.service';
import {AppService} from "../../app.service";

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
        Logger.log('[KAFKA_' + TOPIC_POLL + '] ' + payload);
        this.pollService.pollInitiated(JSON.parse(payload));
    }

    @SubscribeTo(TOPIC_LAUNCH_ORDER)
    allowLaunchSubscriber(payload: string) {
        Logger.log('[KAFKA_ ' + TOPIC_LAUNCH_ORDER + '] ' + payload);
        this.appService.allowLaunch();
    }

}
