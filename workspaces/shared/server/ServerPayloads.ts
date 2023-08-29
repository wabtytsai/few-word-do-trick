import { ServerEvents } from './ServerEvents';

export type ServerPayloads = {
  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.GameWordsUpdate]: {
    words: string[];
  }
};