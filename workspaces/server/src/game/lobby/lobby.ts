import { Server, Socket } from 'socket.io';
import { AuthSocket } from '@server/game/auth-socket';
import GameInstance from '@server/game/game.instance';
import { ServerEvents } from '@shared/server/ServerEvents';

type Key = Socket['id'];

export default class Lobby {
    public readonly createdDate: Date = new Date();
    public readonly clients: Map<Key, AuthSocket> = new Map<Key, AuthSocket>();
    public readonly instance: GameInstance = new GameInstance(this);

    constructor(private readonly server: Server, public readonly id: string) {}

    public addClient(client: AuthSocket): void {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.lobby = this;

        // TODO: emit event to all clients
    }

    public removeClient(client: AuthSocket): void {
        this.clients.delete(client.id);
        client.leave(this.id);
        client.data.lobby = null;

        // TODO: emit event to all clients
    }

    public emitToClients<T>(event: ServerEvents, payload: T): void {
        this.server.to(this.id).emit(event, payload);
    }
}