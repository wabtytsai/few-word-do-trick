export enum ServerEvents
{
  // General
  Pong = 'server.pong',
  Error = 'server.error',

  // Lobby
  LobbyState = 'server.lobby.state',
  LobbyCreated = 'server.lobby.created',
  LobbyJoined = 'server.lobby.joined',

  // Game
  GameMessage = 'server.game.message',
  GameWordsUpdate = 'server.game.words.update',
  GameTimerUpdate = 'server.game.timer.update',
  GameRefreshed = 'server.lobby.refreshed',
}