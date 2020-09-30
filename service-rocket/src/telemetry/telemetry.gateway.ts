import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
} from '@nestjs/websockets';
import {Logger} from "@nestjs/common";
import {SOCKET_PORT} from '../env_variables';

@WebSocketGateway(Number(SOCKET_PORT), {namespace: 'rocket'})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer() server;

    afterInit(): any {
        Logger.log('Socket initiated');
    }

    async handleConnection(){
        Logger.log('A new client is here');
    }

    async handleDisconnect(){
        Logger.log('A client has leaved');
    }

    sendMessageToTelemetry(message: string){
        this.server.emit('telemetryChannel', message);
    }
}