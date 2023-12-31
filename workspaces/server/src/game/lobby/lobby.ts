import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { AuthSocket } from '@server/game/auth-socket';
import GameInstance from '@server/game/game.instance';
import { ServerEvents } from '@shared/server/ServerEvents';
import { RoomTeams } from '@shared/common/RoomTeams';

const ID_LENGTH = 8;

export default class Lobby {
    public readonly id: string = v4().slice(0, ID_LENGTH);
    public readonly createdDate: Date = new Date();
    public readonly clients: Map<Socket['id'], AuthSocket> = new Map<Socket['id'], AuthSocket>();
    public readonly instance: GameInstance = new GameInstance(this);

    constructor(private readonly server: Server) {}

    public addClient(client: AuthSocket): void {
        this.clients.set(client.id, client);
        this.instance.addClientToTeam(client, RoomTeams.waitingRoom);
        client.join(this.id);
        client.data.lobby = this;

        this.instance.emitGameUpdates();
    }

    public removeClient(client: AuthSocket): void {
        this.clients.delete(client.id);
        this.instance.removeClient(client);
        client.leave(this.id);
        client.data.lobby = null;

        this.instance.emitGameUpdates();
    }

    public emitToClients<T>(event: ServerEvents, payload: T): void {
        this.server.to(this.id).emit(event, payload);
    }
}