import {HttpModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import {MONGO_DB, MONGO_HOST, MONGO_PORT} from "./env_variables";
import {PollModule} from './poll/poll.module';

@Module({
    imports: [HttpModule, MongooseModule.forRoot('mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB), PollModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
