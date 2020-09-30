import {Injectable, Logger} from '@nestjs/common';
import {setInterval} from "timers";

@Injectable()
export class AppService {
    telemetryRes: Response;
    calculateAltitude: any;
    altitude = 0;

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch(): string {
        this.initLaunch();
        return "Sayounarada roketto-san";
    }

    initLaunch(): void{
        this.calculateAltitude = setInterval(this.altitudeInterval, 1000);
    }

    altitudeInterval(): void{
        //TODO send information to telemetry
        Logger.log("Calculating altitude... {" + this.altitude + "}");
        this.altitude += 150;
        if(this.altitude > 1000){
            //TODO detach rocket

            // clearInterval(this.calculateAltitude);
        }
    }

    sendStatusToTelemetry(status: string): void{
        //TODO send status to telemetry
    }

}
