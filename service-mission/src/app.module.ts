import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from './env_variables';
import {PollModule} from './poll/poll.module';
import { DataModule } from './data/data.module';
import {KafkaModule} from './kafka/kafka.module';
import {ConsumerModule} from './kafka/consumer/consumer.module';
import {AppController} from "./app.controller";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB),
        DataModule,
        PollModule,
        KafkaModule.register({
            clientId: 'mission-service',
            brokers: ['kafka-service:9092'],
            groupId: 'box-b',
        }),
        ConsumerModule,],
    controllers: [AppController],
    providers: [],
})
export class AppModule {
}
