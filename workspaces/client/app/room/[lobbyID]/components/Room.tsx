'use client'

import { useSocket } from '@client/app/contexts/socket-context';
import BidTracker from './BidTracker';
import TeamTracker from './TeamTracker';
import Timer from './Timer';
import WordsList from './WordsList';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useEffect, useState } from 'react';
import { ServerEvents } from '@shared/server/ServerEvents';
import Header from './Header';

export default function Room() {
  const socket = useSocket();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [words, setWords] = useState<string[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    socket.emit(ClientEvents.LobbyRefresh);

    socket.on(ServerEvents.Error, data => {
      const { message } = data;
      setIsLoading(false);
      setError(message);
    });

    socket.on(ServerEvents.LobbyRefreshed, data => {
      setError(null);
      setIsLoading(false);
      setWords(data['words']);
      setName(data['name']);
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
    <div className='app'>
      <Header />

      <div className='app-container'>
        <div className='main-content'>
          <div className='left-container'>
            {/* <TeamTracker members={['Team 1']} /> */}
          </div>
          <div className='mid-container'>
            <Timer />
            <WordsList words={words} />
            <BidTracker />
          </div>
          <div className='right-container'>
            {/* <TeamTracker members={['Team 2']} /> */}
          </div>
        </div>
      </div>

      <div className='footer'>
      </div>
    </div>
  );
}
