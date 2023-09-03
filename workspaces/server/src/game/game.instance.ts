import Lobby from "@game/lobby/lobby";
import { PRNG } from 'seedrandom';
import words from '@game/words.json'
import { ServerEvents } from "@shared/server/ServerEvents";
import { TimerEvents } from "@shared/common/TimerEvents";
const seedrandom = require('seedrandom');

const PAGE_SIZE = 5;
const BID_MAX = 25;
const BID_MIN = 0;

export default class GameInstance {
    public bid: number = 25;

    private rng: PRNG;
    private words: string[];
    private page: number = 0;

    constructor(private readonly lobby: Lobby) {
        this.rng = seedrandom(lobby.id);
        this.words = [...words];

        this.shuffleWords();
    }

    private shuffleWords(): void {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
        this.page = 0;
    }

    public refreshWords(): string[] {
        if (this.page + PAGE_SIZE >= this.words.length) {
            this.shuffleWords();
        }

        const currentWords = this.words.slice(this.page, this.page + PAGE_SIZE);
        const payload = { words: currentWords };
        this.page += PAGE_SIZE;
        this.lobby.emitToClients(ServerEvents.GameWordsUpdate, payload);
        return currentWords;
    }

    public getCurrentWords(): string[] {
        return this.words.slice(this.page, this.page + PAGE_SIZE);
    }

    public updateBid(bid: number): number {
        this.bid = Math.min(Math.max(bid, BID_MIN), BID_MAX);
        const payload = { bid: this.bid };
        this.lobby.emitToClients(ServerEvents.GameBidUpdate, payload);
        return this.bid;
    }

    public updateTimer(event: TimerEvents): void {
        const payload = { event };
        this.lobby.emitToClients(ServerEvents.GameTimerUpdate, payload);
    }
}