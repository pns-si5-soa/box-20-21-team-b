import {Module} from '@nestjs/common';
import {KafkaModule} from './kafka/kafka.module';
import {ConsumerModule} from './kafka/consumer/consumer.module';

@Module({
    imports: [
        KafkaModule.register({
            clientId: 'mission-service',
            brokers: ['kafka:9092'],
            groupId: 'box-b',
        }),
        ConsumerModule,],
    providers: [],
})
export class AppModule {
}
