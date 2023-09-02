'use client'

import { useSocket } from '@client/app/socket/SocketProvider';
import BidTracker from './components/BidTracker';
import TeamTracker from './components/TeamTracker';
import Timer from './components/Timer';
import WordsList from './components/WordsList';
import { useParams } from 'next/navigation';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useEffect, useState } from 'react';
import { ServerEvents } from '@shared/server/ServerEvents';

const LOBBY_PARAM = 'lobbyID';

export default function Home() {
  const params = useParams();
  const lobbyID = params[LOBBY_PARAM] as string;
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.emit(ClientEvents.LobbyJoin, { lobbyID });
    socket.on(ServerEvents.Error, data => {
      const { message } = data;
      setIsLoading(false);
      setError(message);
    });
    socket.on(ServerEvents.LobbyJoined, () => {
      setError(null);
      setIsLoading(false);
    });

    return () => {
      socket.emit(ClientEvents.LobbyLeave);
    }
  }, [socket]);

  const errorState = <div>Lobby Not Found</div>;
  const loadingState = <div></div>

  if (isLoading) {
    return loadingState;
  } else if (error !== null) {
    return errorState;
  }

  return (
    <div className='room'>
      <div className='header'>
        <div className='lobby'>
          Room: {params[LOBBY_PARAM]}
        </div>
      </div>

      <div className='app-container'>
        <div className='left-container'>
          {/* <TeamTracker members={['Team 1']} /> */}
        </div>
        <div className='mid-container'>
          <Timer />
          <WordsList />
          <BidTracker />
        </div>
        <div className='right-container'>
          {/* <TeamTracker members={['Team 2']} /> */}
        </div>
      </div>

      <div className='footer'>
      </div>
    </div>
  );
}
