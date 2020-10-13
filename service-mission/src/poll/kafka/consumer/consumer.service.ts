import {Injectable} from '@nestjs/common';
import {AbstractKafkaConsumer} from '../kafka.abstract.consumer';
import {SubscribeTo} from '../kafka.decorator';
import {KafkaPayload} from '../kafka.message';

@Injectable()
export class ConsumerService extends AbstractKafkaConsumer {
    protected registerTopic() {
        this.addTopic('hello.topic');
        this.addTopic('hello.fixed.topic');
    }

    /**
     * When group id is unique for every container.
     * @param payload
     */
    @SubscribeTo('hello.topic')
    helloSubscriber(payload: KafkaPayload) {
        console.log('[KAKFA-CONSUMER] Print message after receiving', payload);
    }
}
