import {Test, TestingModule} from '@nestjs/testing';
import { KafkaModule } from '../kafka/kafka.module';
import { KafkaService } from '../kafka/kafka.service';
import {PollController} from './poll.controller';
import { PollService } from './poll.service';

describe('PollController', () => {
    let controller: PollController;

    let service: {}
    let pollService: PollService;
    let kafkaService : KafkaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PollController],
            providers: [PollService],
            imports: [        KafkaModule.register({
                clientId: 'rocket-service',
                brokers: ['kafka:9092'],
                groupId: 'box-b',
            }),
            ]
        }).compile();

        kafkaService = module.get<KafkaService>(KafkaService);
        pollService = module.get<PollService>(PollService);
        controller = module.get<PollController>(PollController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
