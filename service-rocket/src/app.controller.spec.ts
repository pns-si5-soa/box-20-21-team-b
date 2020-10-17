import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import { ConsumerModule } from './kafka/consumer/consumer.module';
import { KafkaModule } from './kafka/kafka.module';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
            imports: [        KafkaModule.register({
                clientId: 'rocket-service',
                brokers: ['kafka:9092'],
                groupId: 'box-b',
            }),
            ConsumerModule]
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.healthCheck()).toEqual('ok');
        });
    });
});
