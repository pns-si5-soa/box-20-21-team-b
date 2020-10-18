import { Injectable, Logger } from '@nestjs/common';
import { Rocket } from "./models/rocket/rocket";
import { HeadModule } from "./models/rocket/headModule";
import { Payload } from "./models/payload";
import { FuelModule } from "./models/rocket/fuelModule";
import { Double, Empty } from "../rpc/actions_pb";
import { clientBooster, clientProbe, clientStage } from "./actions.stub";
import { Response } from 'express'
import {KafkaService} from "./kafka/kafka.service";
import {TOPIC_LAUNCH_EVENT} from "./kafka/topics";

@Injectable()
export class AppService {
    private static rocket: Rocket;
    private static canLaunch = false;

    constructor(private readonly kafkaService: KafkaService) { }

    async getStatus(): Promise<string> {
        await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'Rocket preparation : (fueling ok, status ready)'
            },
            messageType: 'info',
            topicName: TOPIC_LAUNCH_EVENT
        });
        return 'Rocket status : ready';
    }

    public allowLaunch(): string {
        AppService.canLaunch = true;
        Logger.log('Mission commander sent a go. You can now launch the rocket')
        return 'Rocket can now be launched';
    }

    //TODO refactor module management
    public async requestLaunch(): Promise<string> {
        AppService.rocket = new Rocket();
        AppService.rocket.setHeadModule(new HeadModule(20.0, new Payload('210 avenue de la grande ours', 150.5)));
        AppService.rocket.addModule(new FuelModule(100.0));
        AppService.rocket.setNumberInitialStages();
        this.launchingSequence();
        return "Rocket launching sequence started";
    }

    private async launchingSequence(): Promise<void>{
        await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'Rocket on internal power',
                timestamp: Date.now(),
            },
            messageType: 'info',
            topicName: TOPIC_LAUNCH_EVENT
        });

        setTimeout(async function(){
            await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                messageId: '' + new Date().valueOf(),
                body: {
                    value: 'Startup (T-00:01:00)',
                    timestamp: Date.now(),
                },
                messageType: 'info',
                topicName: TOPIC_LAUNCH_EVENT
            });
            setTimeout(async function(){
                await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                    messageId: '' + new Date().valueOf(),
                    body: {
                        value: 'Main engine start (T-00:00:03)',
                        timestamp: Date.now(),
                    },
                    messageType: 'info',
                    topicName: TOPIC_LAUNCH_EVENT
                });
                setTimeout(async function(){
                    await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                        messageId: '' + new Date().valueOf(),
                        body: {
                            value: 'Liftoff/Launch (T+00:00:00)',
                            timestamp: Date.now(),
                        },
                        messageType: 'info',
                        topicName: TOPIC_LAUNCH_EVENT
                    });
                    Logger.log("Starting client booster")
                    clientBooster.toggleRunning(new Empty(), function(err, response){
                        if (response !== undefined) {
                            Logger.log(response.getContent());
                        }
                        else {
                           Logger.error('Error: gRPC communication fail:' + err);
                        }
                    });

                    Logger.log("Starting client middle")
                    clientStage.toggleRunning(new Empty(), function(err, response){
                        if (response !== undefined) {
                            Logger.log(response.getContent());
                        }
                        else {
                            Logger.error('Error: gRPC communication fail:' + err);
                        }
                    });

                    Logger.log("Starting client payload")
                    clientProbe.toggleRunning(new Empty(), function(err, response){
                        if (response !== undefined) {
                            Logger.log(response.getContent());
                        }
                        else {
                            Logger.error('Error: gRPC communication fail:' + err);
                        }
                    });
                }.bind(this), 1000)
            }.bind(this), 1000)
        }.bind(this), 1000)
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
