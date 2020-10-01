import { Injectable, Logger } from '@nestjs/common';
import { setInterval } from "timers";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";

@Injectable()
export class AppService {
    private calculateAltitude: any;
    private altitude = 0;

    constructor(private readonly telemetryGateway: TelemetryGateway) {
    }

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch(): string {
        this.initLaunch();
        this.telemetryGateway.sendProcess("Rocket Launched")
        return "Sayounarada roketto-san";
    }

    initLaunch(): void {
        this.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1000);
    }

    altitudeInterval(): void {
        Logger.log("Calculating altitude... " + this.altitude + "m");
        this.telemetryGateway.sendPosition(this.altitude);
        this.altitude += 100;
        if (this.altitude == 1000) {
            Logger.log('Detaching part...');
            this.telemetryGateway.sendProcess('Detaching part');
        } else if (this.altitude == 2000) {
            Logger.log('Charging payload...');
            this.telemetryGateway.sendProcess('Charging payload');
            this.altitude = 0;
            clearInterval(this.calculateAltitude);
        }
    }

    sendStatusToTelemetry(status: string): void {
        this.telemetryGateway.sendProcess(status);
    }

}
