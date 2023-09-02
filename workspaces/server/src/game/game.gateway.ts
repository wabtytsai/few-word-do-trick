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
import { TimerEvents } from '@shared/common/TimerEvents';
import { Logger } from '@nestjs/common';
import LobbyManager from '@game/lobby/lobby.manager';
import { AuthSocket } from '@server/game/auth-socket';
import { ServerException } from './server.exception';

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
        this.logger.log('Handled connection', client.id);
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

    @SubscribeMessage(ClientEvents.LobbyCreate)
    onLobbyCreate(client: AuthSocket): 
    WsResponse<ServerPayloads[ServerEvents.LobbyJoined]> {
        const lobby = this.lobbyManager.createLobby();
        lobby.addClient(client);

        this.logger.log('Lobby created', lobby, client);

        return {
            event: ServerEvents.LobbyCreated,
            data: {
                message: 'Created lobby',
                lobbyID: lobby.id,
            }
        };
    }

    @SubscribeMessage(ClientEvents.LobbyJoin)
    onLobbyJoin(@ConnectedSocket() client: AuthSocket, @MessageBody('lobbyID') lobbyID: string): 
    WsResponse<ServerPayloads[ServerEvents.LobbyJoined]> {
        console.log('join', lobbyID);
        try {
            this.lobbyManager.joinLobby(lobbyID, client);
        } catch (e) {
            this.logger.log('Cannot find lobby', lobbyID, client);
            return {
                event: ServerEvents.Error,
                data: {
                    message: 'Cannot find lobby',
                }
            }
        }

        this.logger.log('Lobby joined', lobbyID, client);

        return {
            event: ServerEvents.LobbyJoined,
            data: {
                message: 'Joined lobby',
                lobbyID,
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


    // Propagate events //

    @SubscribeMessage(ClientEvents.GameGetWords)
    onGameGetWords(@ConnectedSocket() client: AuthSocket): void {
        const words = client.data.lobby.instance.refreshWords();
        this.logger.log('Got new words', client.data.lobby, words);
    }

    @SubscribeMessage(ClientEvents.GameSetBid)
    onGameSetBid(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('bid') bid: number
    ): void {
        const updatedBid = client.data.lobby.instance.updateBid(bid);
        this.logger.log('Updated bid', client.data.lobby, updatedBid);
    }

    @SubscribeMessage(ClientEvents.GameUpdateTimer)
    onGameUpdateTimer(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('event') event: TimerEvents,
    ): void {
        const bid = client.data.lobby.instance.updateTimer(event);
        this.logger.log('Updated timer', client.data.lobby, event);
    }
}