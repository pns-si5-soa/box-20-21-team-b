import {Injectable} from '@nestjs/common';


@Injectable()
export class AppService {
    getWeatherStatus(): string{
        return "Weather status : " + this.getTemperature() + ' ' + this.getHumidity();
    }

    getTemperature(): string {
        return 'The temperature is currently 38°.';
    }

    getHumidity(): string {
        return 'The humidity is about 52%.';
    }
}
