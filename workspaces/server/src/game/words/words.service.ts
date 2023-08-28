import { PRNG } from 'seedrandom';
import words from '@game/words.json';
const seedrandom = require('seedrandom');

const PAGE_SIZE = 5;

export default class WordsService {
    private rng: PRNG;
    private words: string[];
    private page: number = 0;

    constructor(lobbyID: string) {
        this.rng = seedrandom(lobbyID);
        this.words = [...words];
    }

    public initialize(): void {
        this.shuffle();
    }

    private shuffle(): void {
        // Shuffle the word using lobby id as seed
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
    }

    public getNext(): string[] {
        if (this.page >= this.words.length || this.page + PAGE_SIZE >= this.words.length) {
            this.shuffle();
            this.page = 0;
        }

        const words = this.words.slice(this.page, this.page + PAGE_SIZE);
        this.page += PAGE_SIZE;
        return words;
    }
}