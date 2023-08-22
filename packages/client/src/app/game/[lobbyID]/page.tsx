import BidTracker from './components/BidTracker';
import Lobby from './components/Lobby';
import TeamTracker from './components/TeamTracker';
import Timer from './components/Timer';
import WordsList from './components/WordsList';

export default function Home() {
  const words = ['apple', 'mailbox', 'membership', 'microwave', 'anime'];
  return (
    <div className='app'>
      <div className='header'>
        <Lobby />
      </div>

      <div className='app-container'>
        <div className='left-container'>
          <TeamTracker members={['ed']} />
        </div>
        <div className='mid-container'>
          <Timer />
          <WordsList words={words} />
          <BidTracker />
        </div>
        <div className='right-container'>
          <TeamTracker members={['tian']} />
        </div>
      </div>

      <div className='footer'>
      </div>
    </div>
  )
}
