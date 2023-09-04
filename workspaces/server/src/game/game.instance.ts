import Lobby from "@game/lobby/lobby";
import { PRNG } from 'seedrandom';
import words from '@game/words.json'
import { Socket } from 'socket.io';
import { AuthSocket } from '@server/game/auth-socket';
import { ServerEvents } from "@shared/server/ServerEvents";
import { TimerEvents } from "@shared/common/TimerEvents";
import { ServerPayloads } from "@shared/server/ServerPayloads";
import { RoomTeams } from "@shared/common/RoomTeams";
const seedrandom = require('seedrandom');

const PAGE_SIZE = 5;
const BID_MAX = 25;
const BID_MIN = 0;

export default class GameInstance {
    public bid: number = 25;

    private rng: PRNG;
    private words: string[];
    private page: number = 0;
    private waitingRoom: Map<Socket['id'], AuthSocket> = new Map<Socket['id'], AuthSocket>();
    private teamA: Map<Socket['id'], AuthSocket> = new Map<Socket['id'], AuthSocket>();
    private teamB: Map<Socket['id'], AuthSocket> = new Map<Socket['id'], AuthSocket>();

    constructor(private readonly lobby: Lobby) {
        this.rng = seedrandom(lobby.id);
        this.words = [...words];

        this.shuffle(this.words);
    }

    private shuffle(array: any[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        this.page = 0;
    }

    public refreshWords() {
        if (this.page + PAGE_SIZE >= this.words.length) {
            this.shuffle(this.words);
        }
        this.page += PAGE_SIZE;
        const payload = { words: this.getCurrentWords() };
        this.lobby.emitToClients(ServerEvents.GameWordsUpdate, payload);
    }

    public getCurrentWords(): string[] {
        return this.words.slice(this.page, this.page + PAGE_SIZE);
    }

    public setBid(bid: number) {
        this.bid = Math.min(Math.max(bid, BID_MIN), BID_MAX);
    }

    public updateTimer(event: TimerEvents): void {
        const payload = { event };
        this.lobby.emitToClients(ServerEvents.GameTimerUpdate, payload);
    }

    public shuffleTeams() {
        this.waitingRoom.clear();
        this.teamA.clear();
        this.teamB.clear();
        const clients = Array.from(this.lobby.clients.values());
        const halfWay = Math.ceil(clients.length / 2);
        this.shuffle(clients);
        for (let i = 0; i < halfWay; i++) {
            this.teamA.set(clients[i].id, clients[i]);
        }
        for (let i = halfWay; i < clients.length; i++) {
            this.teamB.set(clients[i].id, clients[i]);
        }
    }

    public addClientToTeam(client: AuthSocket, team: RoomTeams) {
        let teamMap;
        switch (team) {
            case (RoomTeams.waitingRoom): {
                teamMap = this.waitingRoom;
                break;
            }
            case (RoomTeams.teamA): {
                teamMap = this.teamA;
                break;
            }
            case (RoomTeams.teamB): {
                teamMap = this.teamB;
                break;
            }
        }
        this.waitingRoom.delete(client.id);
        this.teamA.delete(client.id);
        this.teamB.delete(client.id);
        teamMap.set(client.id, client);
    }

    public removeClient(client: AuthSocket) {
        this.waitingRoom.delete(client.id);
        this.teamA.delete(client.id);
        this.teamB.delete(client.id);
    }

    public getTeams(): ServerPayloads['players'] {
        const getName = (client: AuthSocket) => client.data.name as string;
        const waitingRoom = Array.from(this.waitingRoom.values()).map(getName);
        const teamA = Array.from(this.teamA.values()).map(getName);
        const teamB = Array.from(this.teamB.values()).map(getName);

        return { waitingRoom, teamA, teamB };
    }

    public emitGameUpdates() {
        const payload = {
            words: this.getCurrentWords(),
            players: this.getTeams(),
            bid: this.bid,
        }
        this.lobby.emitToClients(ServerEvents.GameRefreshed, payload);
    }
}