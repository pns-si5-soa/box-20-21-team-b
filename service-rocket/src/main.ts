import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {PORT} from './env_variables';
import {Empty} from '../rpc/actions_pb';
import {client} from './actions.stub';

async function bootstrap() {

    await client.boom(new Empty(), function(err, response) {
        if(response !== undefined)
            console.log('Response: ', response.getContent());
        else
            console.log('gRPC fail')
    });

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({logger: true})
    );
    await app.listen(Number(PORT), "0.0.0.0");
}

bootstrap();
