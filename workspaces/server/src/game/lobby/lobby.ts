import { v4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { AuthSocket } from '@server/game/auth-socket';
import Instance from '@game/instance';

type Key = Socket['id'];

const ID_LENGTH = 8;

export default class Lobby {
    public readonly id: string = v4().slice(0, ID_LENGTH);
    public readonly createdDate: Date = new Date();
    public readonly clients: Map<Key, AuthSocket> = new Map<Key, AuthSocket>();
    public readonly instance: Instance = new Instance(this);

    constructor(private readonly server: Server) {}

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
}