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
import { RoomTeams } from '@shared/common/RoomTeams';

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
        this.logger.log('Handled disconnection', client.id);
    }

    @SubscribeMessage(ClientEvents.Ping)
    onPing(client: AuthSocket): void {
        client.emit(ServerEvents.Pong, {
            message: 'pong',
        });
        this.logger.log('Pong', client.id);
    }

    @SubscribeMessage(ClientEvents.LobbyCreate)
    onLobbyCreate(
        @ConnectedSocket() client: AuthSocket,
        @MessageBody('name') name: string): 
    WsResponse<ServerPayloads> {
        const lobby = this.lobbyManager.createLobby();
        client.data.name = name;
        lobby.addClient(client);

        this.logger.log('Lobby created', lobby, client.id);

        return {
            event: ServerEvents.LobbyCreated,
            data: {
                message: 'Created lobby',
                lobbyID: lobby.id,
            }
        };
    }

    @SubscribeMessage(ClientEvents.LobbyJoin)
    onLobbyJoin(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('lobbyID') lobbyID: string,
        @MessageBody('name') name: string): 
    WsResponse<ServerPayloads> {
        try {
            client.data.name = name;
            this.lobbyManager.joinLobby(lobbyID, client);
        } catch (e) {
            client.data.name = null;
            this.logger.log('Cannot find lobby', lobbyID, client.id);
            return {
                event: ServerEvents.Error,
                data: {
                    message: 'Cannot find lobby',
                }
            }
        }

        this.logger.log('Lobby joined', lobbyID, client.id);

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
    WsResponse<ServerPayloads> {
        this.lobbyManager.leaveLobby(client);

        this.logger.log('Lobby left', client.id);

        return {
            event: ServerEvents.GameMessage,
            data: {
                message: 'Left lobby',
            }
        }
    }

    @SubscribeMessage(ClientEvents.GameRefresh)
    onGameRefresh(@ConnectedSocket() client: AuthSocket): void {
        const lobby = client.data.lobby;
        if (lobby === null) {
            client.emit(ServerEvents.Error, { message: 'Cannot find lobby' });
            return;
        }
        lobby.instance.emitGameUpdates();
    }

    @SubscribeMessage(ClientEvents.GameGetWords)
    onGameGetWords(@ConnectedSocket() client: AuthSocket): void {
        client.data.lobby.instance.refreshWords();
        this.logger.log('Refreshed words');
    }

    @SubscribeMessage(ClientEvents.GameSetBid)
    onGameSetBid(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('bid') bid: number
    ): void {
        client.data.lobby.instance.setBid(bid);
        client.data.lobby.instance.emitGameUpdates();
        this.logger.log('Updated bid');
    }

    @SubscribeMessage(ClientEvents.GameUpdateTimer)
    onGameUpdateTimer(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('event') event: TimerEvents,
    ): void {
        client.data.lobby.instance.updateTimer(event);
        this.logger.log('Updated timer');
    }

    @SubscribeMessage(ClientEvents.GameShuffleTeam)
    onGameShuffleTeam(
        @ConnectedSocket() client: AuthSocket, 
    ): void {
        client.data.lobby.instance.shuffleTeams();
        client.data.lobby.instance.emitGameUpdates();
        this.logger.log('Shuffled team');
    }

    @SubscribeMessage(ClientEvents.GameJoinTeam)
    onGameJoinTeam(
        @ConnectedSocket() client: AuthSocket, 
        @MessageBody('roomTeam') roomTeam: RoomTeams,
    ): void {
        client.data.lobby.instance.addClientToTeam(client, roomTeam);
        client.data.lobby.instance.emitGameUpdates();
        this.logger.log('Joined team');
    }
}