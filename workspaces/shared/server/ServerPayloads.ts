import { ServerEvents } from './ServerEvents';


export type ServerPayloads = {
  message?: string;
  lobbyID?: string;
  words?: string[];
  players?: Players;
};

export type Players = {
  waitingRoom: string[];
  teamA: string[];
  teamB: string[];
}