export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyState = 'server.lobby.state',
  LobbyCreated = 'server.lobby.created',

  // Game
  GameMessage = 'server.game.message',
  GameRefreshWords = 'server.game.refresh-words',
}