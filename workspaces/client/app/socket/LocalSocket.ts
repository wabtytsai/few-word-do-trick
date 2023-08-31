import { ClientEvents } from "@shared/client/ClientEvents";
import { ServerEvents } from "@shared/server/ServerEvents";
import words from './words.json';

type EventType = ClientEvents | ServerEvents;
type CallbackType = (data: any) => void;

const PAGE_SIZE = 5;

export default class LocalSocket {
    private readonly subscribedEvents: Map<EventType, CallbackType> =
        new Map<EventType, CallbackType>();
    private words: string[];
    private page: number = 0;

    constructor() {
        this.words = [...words];
        this.init();
    }

    public on(event: EventType, callback: CallbackType) {
        this.subscribedEvents.set(event, callback);
    }

    public emit(event: EventType, data: any = {}) {
        const callback = this.subscribedEvents.get(event);
        if (!callback) {
            return;
        }
        callback(data);
    }

    private init() {
        const fakeLobbyEvent = () => {
            this.emit(ServerEvents.LobbyCreated, { lobbyID: 'LocalGame' });
        }

        this.on(ClientEvents.LobbyCreate, fakeLobbyEvent);
        this.on(ClientEvents.LobbyJoin, fakeLobbyEvent);

        const getWords = () => {
            if (this.page + PAGE_SIZE >= this.words.length) {
                this.shuffleWords();
            }
    
            const currentWords = this.words.slice(this.page, this.page + PAGE_SIZE);
            const payload = { words: currentWords };
            this.page += PAGE_SIZE;
            this.emit(ServerEvents.GameWordsUpdate, payload);
        }
        this.on(ClientEvents.GameGetWords, getWords);

        this.shuffleWords();
    }

    private shuffleWords() {
        for (let i = this.words.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
        this.page = 0;
    }
}