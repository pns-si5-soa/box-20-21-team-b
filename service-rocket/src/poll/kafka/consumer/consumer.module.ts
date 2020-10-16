import {HttpModule, Module} from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import {PollService} from "../../poll.service";
import {AppService} from "../../../app.service";
import {TelemetryGateway} from "../../../telemetry/telemetry.gateway";

@Module({
  imports: [HttpModule],
  providers: [ConsumerService, PollService, AppService, TelemetryGateway],
})
export class ConsumerModule {}
