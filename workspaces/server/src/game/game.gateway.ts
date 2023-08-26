import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

@WebSocketGateway()
export class GameGateway implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect {
    
    @WebSocketServer()
    server: Server;

    afterInit(server: Server): any {
        // Pass server instance to managers
        // this.lobbyManager.server = server;

        // this.logger.log('Game server initialized !');
    }

    async handleConnection(client: Socket, ...args: any[]): Promise<void> {
        // Call initializers to set up socket
        // this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
    }

    async handleDisconnect(client: Socket): Promise<void> {
        // Handle termination of socket
        // this.lobbyManager.terminateSocket(client);
    }

    @SubscribeMessage(ClientEvents.Ping)
    onPing(client: Socket): void {
        client.emit(ServerEvents.Pong, {
            message: 'pong',
        });
    }
}