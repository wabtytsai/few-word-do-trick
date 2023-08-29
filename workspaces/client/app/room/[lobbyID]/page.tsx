'use client'

import BidTracker from './components/BidTracker';
import LobbyName from './components/LobbyName';
import TeamTracker from './components/TeamTracker';
import Timer from './components/Timer';
import WordsList from './components/WordsList';
import useWebSocket from '@client/app/websocket/useWebSocket';
import { useParams } from 'next/navigation';

const PROTOCOL = "http://"
const SOCKET_URL = '127.0.0.1:4000/';

export default function Home() {
  const { lobbyID } = useParams();
  const { words, getNewWords, bid, updateBid } = useWebSocket(
    PROTOCOL + SOCKET_URL, 
    lobbyID as string);

  return (
    <div className='app'>
      <div className='header'>
        <LobbyName />
      </div>

      <div className='app-container'>
        <div className='left-container'>
          <TeamTracker members={['Team 1']} />
        </div>
        <div className='mid-container'>
          <Timer />
          <WordsList words={words} getNewWords={getNewWords} />
          <BidTracker bid={bid} updateBid={updateBid} />
        </div>
        <div className='right-container'>
          <TeamTracker members={['Team 2']} />
        </div>
      </div>

      <div className='footer'>
      </div>
    </div>
  )
}
