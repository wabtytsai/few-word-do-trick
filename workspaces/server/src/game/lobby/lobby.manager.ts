import { Server } from "socket.io";
import Lobby from "@game/lobby/lobby";
import { AuthSocket } from "@server/game/auth-socket";
import { Cron, CronExpression } from '@nestjs/schedule';
import { LOBBY_MAX_LIFETIME_HOUR } from "@game/constants";
import { ServerException } from "../server.exception";
import { SocketExceptions } from "@shared/server/SocketExceptions";

export default class LobbyManager {
    public server: Server;
    private readonly lobbies: Map<Lobby['id'], Lobby> = new Map<Lobby['id'], Lobby>();

    public initializeSocket(client: AuthSocket): void {
        client.data.lobby = null;
    }

    public closeSocket(client: AuthSocket): void {
        client.data.lobby?.removeClient(client);
    }

    public createLobby(): Lobby {
        const lobby = new Lobby(this.server);
        this.lobbies.set(lobby.id, lobby);
        return lobby;
    }

    public joinLobby(lobbyID: string, client: AuthSocket): void {
        const lobby = this.lobbies.get(lobbyID);

        if (!lobby) {
            throw new ServerException(
                SocketExceptions.LobbyError,
                'Lobby not found');
        }
        lobby.addClient(client);
    }

    public leaveLobby(client: AuthSocket): void {
        client.data.lobby?.removeClient(client);
    }

    @Cron(CronExpression.EVERY_HOUR)
    private cleanUpLobbies(): void {
        for (const [lobbyID, lobby] of this.lobbies) {
            const now = (new Date()).getTime();
            const lobbyCreatedDate = lobby.createdDate.getTime();
            const lobbyAge = now - lobbyCreatedDate;

            if (lobbyAge > LOBBY_MAX_LIFETIME_HOUR) {
                this.lobbies.delete(lobby.id);
            }
        }
    }
}