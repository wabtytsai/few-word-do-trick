'use client'

import BidTracker from './components/BidTracker';
import LobbyName from './components/LobbyName';
import TeamTracker from './components/TeamTracker';
import Timer from './components/Timer';
import WordsList from './components/WordsList';

export default function Home() {
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
          <WordsList />
          <BidTracker />
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
