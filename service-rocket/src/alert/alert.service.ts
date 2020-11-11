import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { TOPIC_ROCKET_EVENT } from 'src/kafka/topics';
import { Response } from 'express'


@Injectable()
export class AlertService {
    constructor(private readonly kafkaService: KafkaService, private readonly appService: AppService) {

    }

    alertHandler(response: Response, alertName: string, rocketId: number, moduleId: number, severity: string): boolean {
        console.log(`Entering in alert handler for ${alertName} level ${severity}`);
        switch (severity) {
            case "critical":
                this.kafkaService.sendMessage(TOPIC_ROCKET_EVENT, {
                    messageId: '' + new Date().valueOf(),
                    body: {
                        client: 'rocket',
                        value: `Alert ${alertName} has been detected in module ${moduleId} of rocket ${rocketId}, auto-destruction engaged`,
                        rocketId: rocketId
                    },
                    messageType: 'info',
                    topicName: TOPIC_ROCKET_EVENT
                }).then((_) => {
                    console.log("Then du alert");
                    this.appService.boom(response, rocketId, moduleId);
                }).catch((err) => console.log(err))
                break;
        }
        return true;
    }
}
