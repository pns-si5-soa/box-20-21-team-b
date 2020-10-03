import { Injectable, Logger } from '@nestjs/common';
import { setInterval } from "timers";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";
import {Rocket} from "./models/rocket/rocket";

@Injectable()
export class AppService {
    private payloadAltitudeToDetach = 120;
    private calculateAltitude: any;
    private rocket: Rocket;

    constructor(private readonly telemetryGateway: TelemetryGateway) {}

    getStatus(): string {
        return 'Rocket is ready to take off !';
    }

    requestLaunch(): string {
        //TODO create a factory to build rocket
        this.rocket = new Rocket();

        this.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1000);
        this.telemetryGateway.sendProcess("Rocket Launched");
        return "Sayounarada roketto-san";
    }

    public detachFuelPart(): string{
        if(this.rocket.numberOfStages() == 1){
            return 'Rocket fuel already separated';
        }
        this.telemetryGateway.sendProcess('Separate rocket part at ' + this.rocket.altitude + 'km');
        this.rocket.detachLastModule();
        return 'Rocket fuel part separated';
    }

    public detachPayloadPart(): string{
        if(!this.rocket.head.payload){
            return 'Rocket payload already separated';
        }
        this.telemetryGateway.sendProcess('Separate payload part at ' + this.rocket.altitude + 'km');
        this.rocket.detachPayload();
        clearInterval(this.calculateAltitude);
        return 'Rocket fuel part separated';
    }

    private altitudeInterval(): void {
        Logger.log("Calculating altitude... " + this.rocket.altitude + "m");
        this.telemetryGateway.sendPosition(this.rocket.altitude);
        this.rocket.altitude += 10;


        //TODO detach first part when fuel is empty
        // if(this.rocket.fuel == 0){
        //     this.detachFuelPart();
        // }

        if (this.rocket.altitude == this.payloadAltitudeToDetach) {
            this.detachPayloadPart();
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
