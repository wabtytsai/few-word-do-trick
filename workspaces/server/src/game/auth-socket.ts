import { Socket } from 'socket.io';
import { ServerEvents } from "@shared/server/ServerEvents";
import Lobby from "@game/lobby/lobby";

export type AuthSocket = Socket & {
    data: {
        lobby: null | Lobby;
    };

    emit: <T>(event: ServerEvents, data: T) => boolean;
}