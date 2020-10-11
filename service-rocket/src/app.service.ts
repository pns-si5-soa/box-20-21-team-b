import { Injectable, Logger } from '@nestjs/common';
import { setInterval } from "timers";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";
import {Rocket} from "./models/rocket/rocket";
import {HeadModule} from "./models/rocket/headModule";
import {Payload} from "./models/payload";
import {FuelModule} from "./models/rocket/fuelModule";
import {Double, Empty} from "../rpc/actions_pb";
import {client} from "./actions.stub";

@Injectable()
export class AppService {
    private payloadAltitudeToDetach = 200;
    private calculateAltitude: any;
    private rocket: Rocket;
    private canLaunch = false;

    constructor(private readonly telemetryGateway: TelemetryGateway) {}

    getStatus(): string {
        return 'Rocket status : ready';
    }

    allowLaunch(): string{
        this.canLaunch = true;
        Logger.log('Mission commander sent a go. You can now launch the rocket')
        return 'Rocket can now be launched';
    }

    requestLaunch(): string {
        this.rocket = new Rocket();
        this.rocket.setHeadModule(new HeadModule(20.0, new Payload('210 avenue de la grande ours', 150.5)));
        this.rocket.addModule(new FuelModule(100.0));
        this.rocket.setNumberInitialStages();

        this.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1500);
        this.telemetryGateway.sendProcess("Rocket Launched");
        return "Launching the rocket!";
    }

    public detachFuelPart(): string{
        if(this.rocket.numberOfStages() == 1){
            return 'Rocket fuel already separated';
        }
        this.telemetryGateway.sendProcess('Separate rocket at ' + this.rocket.altitude + 'km and fuel was ' + this.rocket.getFuelAtLastModule());
        this.rocket.detachLastModule();
        return 'Rocket fuel part separated';
    }

    public detachPayloadPart(): string{
        if(!this.rocket.head.payload){
            return 'Rocket payload already separated';
        }
        this.telemetryGateway.sendProcess('Separate payload at ' + this.rocket.altitude + 'km and fuel was ' + this.rocket.getFuelAtLastModule());
        this.rocket.detachPayload();
        clearInterval(this.calculateAltitude);
        return 'Rocket payload part separated';
    }

    private altitudeInterval(): void {
        Logger.log("Calculating altitude... " + this.rocket.altitude + "km");
        this.telemetryGateway.sendPosition(this.rocket.altitude);
        this.rocket.altitude += 10;
        if(this.rocket.numberOfStages() > 1)
            this.rocket.removeFuel(8);
        else
            this.rocket.removeFuel(1); //head consomme moins


        if(this.rocket.getFuelAtLastModule() == 0){
            this.detachFuelPart();
        }

        if (this.rocket.altitude >= this.payloadAltitudeToDetach) {
            this.detachPayloadPart();
        }
    }

    public setPayloadAltitudeToDetach(altitudeToDetach: number): string{
        this.payloadAltitudeToDetach = altitudeToDetach;
        this.telemetryGateway.sendProcess('Altitude to detach payload : ' + this.payloadAltitudeToDetach);
        return 'Altitude to detach payload is now ' + this.payloadAltitudeToDetach + 'km';
    }

    public sendStatusToTelemetry(status: string): void {
        this.telemetryGateway.sendProcess(status);
    }

    public boom(): string {
        let res = '';
        client.boom(new Empty(), function(err, response) {
            if(response !== undefined)
                res = response.getContent();
            else
                res = 'Error: gRPC communication fail';
        });
        return res;
    }

    detachModule() {
        let res = '';
        client.detach(new Empty(), function(err, response) {
            if(response !== undefined)
                res = response.getVal() ? 'Successfully detached module' : 'Error: could not detach module';
            else
                res = 'Error: gRPC communication fail';
        });
        return res;
    }

    setThrustersSpeed(value: number) {
        let res = '';
        const speed = new Double();
        speed.setVal(value);
        client.setThrustersSpeed(speed, function(err, response) {
            if(response !== undefined)
                res = response.getContent();
            else
                res = 'Error: gRPC communication fail';
        });
        return res;
    }
}
