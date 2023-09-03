'use client'

import { SocketProvider } from './contexts/socket-context';
import Home from './components/Home';

export default function App() {
  return (
    <div className='app'>
      <SocketProvider>
        <div className='app-container'>
          <Home />
        </div>
      </SocketProvider>
    </div>
  )
}
