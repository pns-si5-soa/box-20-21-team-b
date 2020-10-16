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
    private static payloadAltitudeToDetach = 200;
    private static calculateAltitude: any;
    private static rocket: Rocket;
    private static canLaunch = false;

    constructor(private readonly telemetryGateway: TelemetryGateway) { }

    getStatus(): string {
        return 'Rocket status : ready';
    }

    allowLaunch(): string {
        AppService.canLaunch = true;
        Logger.log('Mission commander sent a go. You can now launch the rocket')
        return 'Rocket can now be launched';
    }

    //TODO refactor module management
    requestLaunch(): string {
        AppService.rocket = new Rocket();
        AppService.rocket.setHeadModule(new HeadModule(20.0, new Payload('210 avenue de la grande ours', 150.5)));
        AppService.rocket.addModule(new FuelModule(100.0));
        AppService.rocket.setNumberInitialStages();

        AppService.calculateAltitude = setInterval(this.altitudeInterval.bind(this), 1500);
        this.telemetryGateway.sendProcess("Rocket Launched");
        return "Launching the rocket!";
    }

    //TODO remove in next release
    private altitudeInterval(): void {
        Logger.log("Calculating altitude... " + AppService.rocket.altitude + "km");
        this.telemetryGateway.sendPosition(AppService.rocket.altitude);
        AppService.rocket.altitude += 10;
        if (AppService.rocket.numberOfStages() > 1)
            AppService.rocket.removeFuel(8);
        else
            AppService.rocket.removeFuel(1); //head consomme moins


        if (AppService.rocket.getFuelAtLastModule() == 0) {
            //this.detachFuelPart();
        }

        if (AppService.rocket.altitude >= AppService.payloadAltitudeToDetach) {
            //this.detachPayloadPart();
        }
    }

    //TODO remove in next release
    public setPayloadAltitudeToDetach(altitudeToDetach: number): string {
        AppService.payloadAltitudeToDetach = altitudeToDetach;
        this.telemetryGateway.sendProcess('Altitude to detach payload : ' + AppService.payloadAltitudeToDetach);
        return 'Altitude to detach payload is now ' + AppService.payloadAltitudeToDetach + 'km';
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

    public detachModule(res: Response, module: string) {
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

    public setThrustersSpeed(value: number, res: Response) {
        const speed = new Double();
        speed.setVal(value);
        clientBooster.setThrustersSpeed(speed, function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    public okActions(res: Response) {
        clientBooster.ok(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    public toggleRunning(res: Response) {
        clientBooster.toggleRunning(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }
}
