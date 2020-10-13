import {HttpModule, Module} from '@nestjs/common';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from "./env_variables";
import {PollModule} from "./poll/poll.module";
import {KafkaModule} from "./poll/kafka/kafka.module";
import {ConsumerModule} from "./poll/kafka/consumer/consumer.module";

@Module({
    imports: [HttpModule,
        MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB),
        PollModule,
        KafkaModule.register({
            clientId: 'mission-service',
            brokers: ['localhost:19092'],
            groupId: 'box-b',
        }),

        ConsumerModule,],
    providers: [AppService],
})
export class AppModule {
}
