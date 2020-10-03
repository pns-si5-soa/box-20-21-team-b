import { Injectable, Logger } from '@nestjs/common';
import { setInterval } from "timers";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";

@Injectable()
export class AppService {
    private payloadAltitudeToDetach = 120;
    private calculateAltitude: any;
    private altitude = 0;

    constructor(private readonly telemetryGateway: TelemetryGateway) {
    }

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch(): string {
        this.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1000);
        this.telemetryGateway.sendProcess("Rocket Launched");
        return "Sayounarada roketto-san";
    }

    public detachFuelPart(): string{
        //TODO : check if part has not already been removed
        this.telemetryGateway.sendProcess('Separate rocket part at ' + this.altitude + 'km');
        return 'Rocket fuel part separated';
    }

    public detachPayloadPart(): string{
        //TODO check if part has not already been removed
        this.telemetryGateway.sendProcess('Separate payload part at ' + this.altitude + 'km');
        return 'Rocket fuel part separated';
    }

    private altitudeInterval(): void {
        Logger.log("Calculating altitude... " + this.altitude + "m");
        this.telemetryGateway.sendPosition(this.altitude);
        this.altitude += 10;

        //TODO detach first part when fuel is empty
        //Logger.log('Detaching part...');
        //this.telemetryGateway.sendProcess('Detaching part');

        if (this.altitude == this.payloadAltitudeToDetach) {
            Logger.log('Charging payload...');
            this.telemetryGateway.sendProcess('Charging payload');
            this.altitude = 0;
            clearInterval(this.calculateAltitude);
        }
    }

    public setPayloadAltitudeToDetach(altitudeToDetach: number): string{
        this.payloadAltitudeToDetach = altitudeToDetach;
        this.telemetryGateway.sendProcess('Altitude to detach payload : ' + this.payloadAltitudeToDetach);
        return 'Ok';
    }

    public sendStatusToTelemetry(status: string): void {
        this.telemetryGateway.sendProcess(status);
    }

}
