import { ServerEvents } from './ServerEvents';


export type ServerPayloads = {
  [ServerEvents.GameMessage]: {
    message: string;
  };

  [ServerEvents.LobbyJoined]: {
    message: string;
    lobbyID?: string;
  };

  [ServerEvents.GameWordsUpdate]: {
    words: string[];
  }
};