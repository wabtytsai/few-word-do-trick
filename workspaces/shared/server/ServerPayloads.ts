import { ServerEvents } from './ServerEvents';


export type ServerPayloads = {
  message?: string;
  lobbyID?: string;
  words?: string[];
};