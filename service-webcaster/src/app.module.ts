import {Module} from '@nestjs/common';
import {KafkaModule} from './kafka/kafka.module';
import {ConsumerModule} from './kafka/consumer/consumer.module';
import {AppController} from "./app.controller";

@Module({
    imports: [
        KafkaModule.register({
            clientId: 'mission-service',
            brokers: ['kafka-service:9092'],
            groupId: 'box-b',
        }),
        ConsumerModule,],
    controllers: [AppController],
})
export class AppModule {
}
