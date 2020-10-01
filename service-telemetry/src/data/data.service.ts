import { Injectable, Logger } from '@nestjs/common';
import { InjectModel} from '@nestjs/mongoose';
import {Model } from 'mongoose'
import { RocketMetric } from './rocketmetric.model';
import {ROCKET_HOST, ROCKET_SOCKET_PORT} from "../env_variables";
import * as io from 'socket.io-client';

@Injectable()
export class DataService {
    constructor(@InjectModel('RocketMetric') private readonly rocketMetric : Model<RocketMetric>){
        const socket = io(`ws://${ROCKET_HOST}:${ROCKET_SOCKET_PORT}/rocket`);
        socket.on('connect', () => {
          Logger.log('Socket initiated');
        });
        socket.on('telemetryChannel', (msg) => {
          console.log('Message received in telemetry : ' + msg);
          //TODO save in database incoming messages
        });
    }


}
