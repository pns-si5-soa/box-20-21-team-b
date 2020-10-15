import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PollModule} from './poll/poll.module';
import {KafkaModule} from './poll/kafka/kafka.module';
import {ConsumerModule} from './poll/kafka/consumer/consumer.module';

@Module({
    imports: [PollModule,
        KafkaModule.register({
            clientId: 'weather-service',
            brokers: ['kafka:9092'],
            groupId: 'box-b',
        }),
        ConsumerModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
