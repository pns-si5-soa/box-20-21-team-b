import {Injectable, Logger} from '@nestjs/common';
import {setInterval} from "timers";

@Injectable()
export class AppService {
    private calculateAltitude: any;
    private altitude = 0;

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch(): string {
        this.initLaunch();
        return "Sayounarada roketto-san";
    }

    initLaunch(): void{
        this.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1000);
    }

    altitudeInterval(): void{
        Logger.log("Calculating altitude... " + this.altitude + "m");
        //TODO send information to telemetry
        this.altitude += 100;
        if(this.altitude == 1000){
            Logger.log('Detaching part...');
            //TODO send information to telemetry
        }else if(this.altitude == 2000){
            Logger.log('Charging payload...');
            //TODO send information to telemetry
            clearInterval(this.calculateAltitude);
        }
    }

    sendStatusToTelemetry(status: string): void{
        //TODO send status to telemetry
    }

}
