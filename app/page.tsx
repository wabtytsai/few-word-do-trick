'use client'

import { SocketProvider } from './socket/SocketProvider';
import Lobby from './Lobby';

export default function Home() {
  return (
    <div className='app'>
      <SocketProvider>
        <Lobby />
      </SocketProvider>
    </div>
  )
}
