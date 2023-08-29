export enum ServerEvents
{
  // General
  Pong = 'server.pong',

  // Lobby
  LobbyState = 'server.lobby.state',
  LobbyCreated = 'server.lobby.created',

  // Game
  GameMessage = 'server.game.message',
  GameWordsUpdate = 'server.game.words.update',
  GameBidUpdate = 'server.game.bid.update',
}