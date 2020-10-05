import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import { RocketMetric, RocketMetricTopic } from './rocketmetric.model';
import { ROCKET_HOST, ROCKET_SOCKET_PORT } from "../env_variables";
import * as io from 'socket.io-client';

@Injectable()
export class DataService {
    constructor(@InjectModel('RocketMetric') private readonly rocketMetric: Model<RocketMetric>) {
        const socket = io(`ws://${ROCKET_HOST}:${ROCKET_SOCKET_PORT}/rocket`, { query: { auth: "TELEMETRY" } });
        socket.on('connect', () => {
            Logger.log('Socket initiated');
        });
        socket.on('processus', async (msg) => {
            Logger.log('Telemetry processus Data : ' + msg);
            await this.insertRocketMetric(RocketMetricTopic.PROCESSUS, msg);
        })
        socket.on('position', async (msg) => {
            Logger.log('Telemetry position Data : ' + msg + 'km');
            await this.insertRocketMetric(RocketMetricTopic.POSITION, `Current altitude is ${msg}`, Date.now().toString(), msg);
        });
    }

    async insertRocketMetric(topic: RocketMetricTopic, description: string, timestamp = Date.now().toString(), altitude = null) {
        const metric = new this.rocketMetric({ topic, description, timestamp, altitude });
        await metric.save();
    }

    async retrieveRocketMetrics() : Promise<RocketMetric[]>{
        return await this.rocketMetric.find().exec();
    }


}
