import {Injectable} from '@nestjs/common';


@Injectable()
export class AppService {

    getTemperature(): string {
        return 'The temperature is currently 38°.';
    }

    getHumidity(): string {
        return 'The humidity is about 52%.';
    }
}
