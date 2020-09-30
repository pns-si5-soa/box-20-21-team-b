import {Injectable, Logger} from '@nestjs/common';
import {ROCKET_HOST, ROCKET_SOCKET_PORT} from "./env_variables";
import * as io from 'socket.io-client';

@Injectable()
export class AppService {
  //private ws = new WebSocket('ws://' + ROCKET_HOST + ':' + ROCKET_SOCKET_PORT + '/rocket');

  constructor() {
    const socket = io('ws://' + ROCKET_HOST + ':' + ROCKET_SOCKET_PORT + '/rocket');
    socket.on('connect', () => {
      Logger.log('Socket initiated');
    });
    socket.on('telemetryChannel', (msg) => {
      console.log('Message received in telemetry : ' + msg);
      //TODO save in database incoming messages
    });
  }
}
