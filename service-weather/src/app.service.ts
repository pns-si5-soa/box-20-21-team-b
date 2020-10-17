import {Injectable} from '@nestjs/common';


@Injectable()
export class AppService {
    public getWeatherStatus(): string{
        return "Weather status : " + this.getTemperature() + ' ' + this.getHumidity();
    }

    private getTemperature(): string {
        return 'The temperature is currently 38°.';
    }

    private getHumidity(): string {
        return 'The humidity is about 52%.';
    }
}
