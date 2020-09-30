import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from "./env_variables";
import {PollModule} from './poll/poll.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import {TelemetryGateway} from "./telemetry/telemetry.gateway";

@Module({
    imports: [TelemetryModule, HttpModule, MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB), PollModule],
    controllers: [AppController],
    providers: [TelemetryGateway, AppService],
})
export class AppModule {
}
