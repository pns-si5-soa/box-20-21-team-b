import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MONGO_DB, MONGO_HOST, MONGO_PORT, PORT} from './env_variables';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({logger: true})
    );
    await app.listen(Number(PORT), '0.0.0.0');
    console.log("mongo URL : " + MONGO_HOST + ":" + MONGO_PORT + "/" + MONGO_DB)
}

bootstrap();
