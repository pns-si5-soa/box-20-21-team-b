import { Injectable, Logger } from '@nestjs/common';
import { setInterval } from "timers";
import { TelemetryGateway } from "./telemetry/telemetry.gateway";
import { Rocket } from "./models/rocket/rocket";
import { HeadModule } from "./models/rocket/headModule";
import { Payload } from "./models/payload";
import { FuelModule } from "./models/rocket/fuelModule";
import { Double, Empty } from "../rpc/actions_pb";
import { clientBooster, clientProbe, clientStage } from "./actions.stub";
import { Response } from 'express'

@Injectable()
export class AppService {
    private payloadAltitudeToDetach = 200;
    private calculateAltitude: any;
    private rocket: Rocket;
    private canLaunch = false;

    constructor(private readonly telemetryGateway: TelemetryGateway) { }

    getStatus(): string {
        return 'Rocket status : ready';
    }

    allowLaunch(): string {
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

    //TODO remove in next release
    private altitudeInterval(): void {
        Logger.log("Calculating altitude... " + this.rocket.altitude + "km");
        this.telemetryGateway.sendPosition(this.rocket.altitude);
        this.rocket.altitude += 10;
        if (this.rocket.numberOfStages() > 1)
            this.rocket.removeFuel(8);
        else
            this.rocket.removeFuel(1); //head consomme moins


        if (this.rocket.getFuelAtLastModule() == 0) {
            //this.detachFuelPart();
        }

        if (this.rocket.altitude >= this.payloadAltitudeToDetach) {
            //this.detachPayloadPart();
        }
    }

    //TODO remove in next release
    public setPayloadAltitudeToDetach(altitudeToDetach: number): string {
        this.payloadAltitudeToDetach = altitudeToDetach;
        this.telemetryGateway.sendProcess('Altitude to detach payload : ' + this.payloadAltitudeToDetach);
        return 'Altitude to detach payload is now ' + this.payloadAltitudeToDetach + 'km';
    }

    public boom(res: Response, module: string): void {
        let moduleToRemove;
        if(module === 'payload')
            moduleToRemove = clientProbe;
        else if(module === 'stage')
            moduleToRemove = clientStage;
        else
            moduleToRemove = clientBooster;
        moduleToRemove.boom(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    detachModule(res: Response, module: string) {
        let moduleToRemove;
        if(module === 'payload')
            moduleToRemove = clientProbe;
        else
            moduleToRemove = clientBooster;
        moduleToRemove.detach(new Empty(), function (err, response) {
            if (response !== undefined) {
                if (response.getVal() === true) {
                    res.status(200).send('Successfully detached module');
                } else {
                    res.status(403).send('Error: could not detach module');
                }
            }
            else {
                res.status(500).send('Error: gRPC communication fail');
            }
        });
        return res;
    }

    setThrustersSpeed(value: number, res: Response) {
        const speed = new Double();
        speed.setVal(value);
        clientBooster.setThrustersSpeed(speed, function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    okActions(res: Response) {
        clientBooster.ok(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    toggleRunning(res: Response) {
        clientBooster.toggleRunning(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }
}
