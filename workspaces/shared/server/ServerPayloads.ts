import { ServerEvents } from './ServerEvents';
// import { CardStateDefinition } from '../common/types';

export type ServerPayloads = {
    [ServerEvents.Pong]: {
        message: string;
    };

//   [ServerEvents.LobbyState]: {
//     lobbyId: string;
//     mode: 'solo' | 'duo';
//     delayBetweenRounds: number;
//     hasStarted: boolean;
//     hasFinished: boolean;
//     currentRound: number;
//     playersCount: number;
//     cards: CardStateDefinition[];
//     isSuspended: boolean;
//     scores: Record<string, number>;
//   };

  [ServerEvents.GameMessage]: {
    message: string;
  };
};