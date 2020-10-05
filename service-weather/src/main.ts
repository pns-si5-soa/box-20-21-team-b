import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {FastifyAdapter, NestFastifyApplication,} from '@nestjs/platform-fastify';
import {PORT} from './env_variables';


async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({logger: true})
    );
    await app.listen(Number(PORT), "0.0.0.0");
}

bootstrap();
