export enum ClientEvents
{
  // General
  Ping = 'client.ping',

  // Lobby
  LobbyCreateOrJoin = 'client.lobby.create-or-join',
  LobbyJoin = 'client.lobby.join',
  LobbyLeave = 'client.lobby.leave',

  // Game
  GameGetWords = 'client.game.get_words',
  GameSetBid = 'client.game.set_bid',
}