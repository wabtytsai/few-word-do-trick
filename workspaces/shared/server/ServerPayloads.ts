import { TimerEvents } from '@shared/common/TimerEvents';
import { ServerEvents } from './ServerEvents';


export type ServerPayloads = {
  message?: string;
  lobbyID?: string;
  words?: string[];
  players?: Players;
  bid?: number;
};

export type Players = {
  waitingRoom: string[];
  teamA: string[];
  teamB: string[];
}