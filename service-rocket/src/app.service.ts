import { Injectable, Logger } from '@nestjs/common';
import { Rocket } from "./models/rocket/rocket";
import { Double, Empty } from "../rpc/actions_pb";
import { Response } from 'express'
import {KafkaService} from "./kafka/kafka.service";
import {TOPIC_LAUNCH_EVENT} from "./kafka/topics";
import { MODULES, MODULES_PORT} from "./env_variables";
import {Module} from "./models/rocket/module";
import {ModuleActionsClient} from "../rpc/actions_grpc_pb";
import {credentials} from "grpc";

@Injectable()
export class AppService {
    private static rockets: Rocket[]
    private static canLaunch = false;

    getRocketWithId(id: number){
        for (const rockets of AppService.rockets) {
            if(rockets.id == id)
                return rockets;
        }
        return null;
    }

    constructor(private readonly kafkaService: KafkaService) {
        AppService.rockets = []

        const rocketsNotCasted = MODULES.split(",")
        let rocket = null;

        let rocketId = -1;
        for(let i = 0;i<rocketsNotCasted.length;i++){
            const id = parseInt(rocketsNotCasted[i], 10);
            if(i%3 === 0){ //id of a rocket
                rocketId = id;
                if((rocket === null || rocket.id !== id)) {
                    rocket = this.getRocketWithId(id);
                    if (rocket === null) { // the rocket does not already exists
                        rocket = new Rocket(id);
                        AppService.rockets.push(rocket)
                    }
                }
            }else{
                const moduleName = rocketsNotCasted[i+1];
                Logger.log('module-actions-' + moduleName + '-' + rocketId + ':'+MODULES_PORT)
                rocket.addModule(new Module(id, new ModuleActionsClient(
                    'module-actions-' + moduleName + '-' + rocketId + ':'+MODULES_PORT,
                    credentials.createInsecure()
                ), moduleName));
                i++;
            }
        }
    }

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

    public allowLaunch(rocketId: number): string {
        AppService.canLaunch = true;
        Logger.log('Mission commander sent a go. You can now launch the rocket with id ' + rocketId)
        return 'Rocket can now be launched';
    }

    public async requestLaunch(rocketId: number): Promise<string> {
        this.launchingSequence(rocketId);
        return "Rocket launching sequence started";
    }

    private async launchingSequence(rocketId: number): Promise<void>{
        await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
            messageId: '' + new Date().valueOf(),
            body: {
                value: 'Rocket ' + rocketId + ' - on internal power',
                timestamp: Date.now(),
                rocketId: rocketId
            },
            messageType: 'info',
            topicName: TOPIC_LAUNCH_EVENT
        });

        setTimeout(async function(){
            await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                messageId: '' + new Date().valueOf(),
                body: {
                    value: 'Rocket ' + rocketId + ' - Startup (T-00:01:00)',
                    timestamp: Date.now(),
                    rocketId: rocketId
                },
                messageType: 'info',
                topicName: TOPIC_LAUNCH_EVENT
            });
            setTimeout(async function(){
                await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                    messageId: '' + new Date().valueOf(),
                    body: {
                        value: 'Rocket ' + rocketId + ' - Main engine start (T-00:00:03)',
                        timestamp: Date.now(),
                        rocketId: rocketId
                    },
                    messageType: 'info',
                    topicName: TOPIC_LAUNCH_EVENT
                });
                setTimeout(async function(){
                    await this.kafkaService.sendMessage(TOPIC_LAUNCH_EVENT, {
                        messageId: '' + new Date().valueOf(),
                        body: {
                            value: 'Rocket ' + rocketId + ' - Liftoff/Launch (T+00:00:00)',
                            timestamp: Date.now(),
                            rocketId: rocketId
                        },
                        messageType: 'info',
                        topicName: TOPIC_LAUNCH_EVENT
                    });

                    const rocket = this.getRocketWithId(rocketId);
                    for(const module of rocket.modules){
                        module.moduleAction.toggleRunning(new Empty(), function(err, response){
                            if (response !== undefined) {
                                Logger.log(response.getContent());
                            }
                            else {
                                Logger.error('Error: gRPC communication fail:' + err);
                            }
                        });
                    }
                }.bind(this), 1000)
            }.bind(this), 1000)
        }.bind(this), 1000)
    }

    public boom(res: Response, rocketId: number, moduleId: number): void {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        module.moduleAction.boom(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    public detachModule(res: Response, rocketId: number, moduleId: number) {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        module.moduleAction.detach(new Empty(), function (err, response) {
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

    public setThrustersSpeed(value: number, res: Response, rocketId: number, moduleId: number) {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        const speed = new Double();
        speed.setVal(value);
        module.moduleAction.setThrustersSpeed(speed, function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    public okActions(res: Response, rocketId: number, moduleId: number) {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        module.moduleAction.ok(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    public toggleRunning(res: Response, rocketId: number, moduleId: number) {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        module.moduleAction.toggleRunning(new Empty(), function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }

    setAltitudeToDetach(value: number, res: Response, rocketId: number, moduleId: number) {
        const module = this.getRocketWithId(rocketId).getModuleWithId(moduleId);
        const alt = new Double();
        alt.setVal(value);
        module.moduleAction.setAltitudeToDetach(alt, function (err, response) {
            if (response !== undefined)
                res.status(200).send(response.getContent());
            else
                res.status(500).send('Error: gRPC communication fail');
        });
    }
}
