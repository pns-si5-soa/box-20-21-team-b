import {Test, TestingModule} from '@nestjs/testing';
import { KafkaModule } from '../kafka/kafka.module';
import { KafkaService } from '../kafka/kafka.service';
import {PollService} from './poll.service';

describe('PollService', () => {
    let service: PollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PollService],
            imports: [        KafkaModule.register({
                clientId: 'rocket-service',
                brokers: ['kafka:9092'],
                groupId: 'box-b',
            }),
            ]
        }).compile();

        service = module.get<PollService>(PollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
