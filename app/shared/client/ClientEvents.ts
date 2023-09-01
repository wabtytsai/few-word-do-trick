export enum ClientEvents {
  // General
  Ping = 'client.ping',

  // Lobby
  LobbyCreate = 'client.lobby.create',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',

  // Game
  GameGetWords = 'client.game.get-words',
  GameSetBid = 'client.game.set-bid',
  GameUpdateTimer = 'client.game.update-timer',
}