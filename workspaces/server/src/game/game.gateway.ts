import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ServerPayloads } from '@shared/server/ServerPayloads';
import { Logger } from '@nestjs/common';
import LobbyManager from '@game/lobby/lobby.manager';
import { AuthSocket } from '@server/game/auth-socket';

@WebSocketGateway({ cors: true })
export class GameGateway implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect {

    private readonly logger: Logger = new Logger(GameGateway.name);

    constructor(
        private readonly lobbyManager: LobbyManager,
    ) {}

    afterInit(server: Server): any {
        this.lobbyManager.server = server;
        this.logger.log('Server created');
    }

    async handleConnection(client: Socket, ...args: any[]): Promise<void> {
        this.lobbyManager.initializeSocket(client as AuthSocket);
        this.logger.log('Handled connection', client);
    }

    async handleDisconnect(client: AuthSocket): Promise<void> {
        this.lobbyManager.closeSocket(client);
        this.logger.log('Handled disconnection', client);
    }

    @SubscribeMessage(ClientEvents.Ping)
    onPing(client: AuthSocket): void {
        client.emit(ServerEvents.Pong, {
            message: 'pong',
        });
        this.logger.log('Pong', client);
    }

    @SubscribeMessage(ClientEvents.LobbyCreateOrJoin)
    onLobbyCreateOrJoin(@ConnectedSocket() client: AuthSocket, @MessageBody('lobbyID') lobbyID: string): 
    WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
        this.lobbyManager.createOrGetLobby(lobbyID, client);

        this.logger.log('Lobby Created or Joined', client);

        return {
            event: ServerEvents.GameMessage,
            data: {
                message: 'Created or joined lobby'
            }
        };
    }

    @SubscribeMessage(ClientEvents.LobbyJoin)
    onLobbyJoin(@ConnectedSocket() client: AuthSocket, @MessageBody('lobbyID') lobbyID: string): 
    WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
        this.lobbyManager.joinLobby(lobbyID, client);

        this.logger.log('Lobby joined', lobbyID, client);

        return {
            event: ServerEvents.GameMessage,
            data: {
                message: 'Joined lobby',
            }
        }
    }

    @SubscribeMessage(ClientEvents.LobbyLeave)
    onLobbyLeave(client: AuthSocket): 
    WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
        this.lobbyManager.leaveLobby(client);

        this.logger.log('Lobby left', client);

        return {
            event: ServerEvents.GameMessage,
            data: {
                message: 'Left lobby',
            }
        }
    }

    @SubscribeMessage(ClientEvents.GameGetWords)
    onGameGetWords(@ConnectedSocket() client: AuthSocket): void {
        const words = client.data.lobby.instance.refreshWords();
        this.logger.log('Got new words', client.data.lobby, words);
    }

    @SubscribeMessage(ClientEvents.GameSetBid)
    onGameSetBid(@ConnectedSocket() client: AuthSocket, @MessageBody('bidNumber') bidNumber: number): void {
        const bid = client.data.lobby.instance.updateBidNumber(bidNumber);
        this.logger.log('Updated bid', client.data.lobby, bid);
    }
}