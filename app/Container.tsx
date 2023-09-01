'use client'

import BidTracker from './components/BidTracker';
import TeamTracker from './components/TeamTracker';
import Timer from './components/Timer';
import WordsList from './components/WordsList';
import { useParams } from 'next/navigation';

const LOBBY_PARAM = 'lobbyID';

export default function Container() {
  const params = useParams();

  return (
    <div className='app'>
      <div className='header'>
        <div className='lobby'>
          Few Word Do Trick
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
  )
}
