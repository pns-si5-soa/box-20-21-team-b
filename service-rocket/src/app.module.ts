import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB, MONGO_HOST, MONGO_PORT } from "./env_variables";
import { PollModule } from './poll/poll.module';
import { KafkaModule } from "./kafka/kafka.module";
import { ConsumerModule } from "./kafka/consumer/consumer.module";
import { AlertController } from './alert/alert.controller';
import { AlertService } from './alert/alert.service';

@Module({
    imports: [HttpModule, MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB), PollModule,
        KafkaModule.register({
            clientId: 'rocket-service',
            brokers: ['kafka-service:9092'],
            groupId: 'box-b',
        }),
        ConsumerModule,
    ],
    controllers: [AppController, AlertController],
    providers: [AppService, AlertService],
})
export class AppModule {
}
