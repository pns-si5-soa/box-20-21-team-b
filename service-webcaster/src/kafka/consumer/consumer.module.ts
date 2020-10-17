import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';

@Module({
  imports: [HttpModule, ],
  providers: [ConsumerService],
})
export class ConsumerModule {}
