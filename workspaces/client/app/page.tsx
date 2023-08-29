'use client'

import { useRouter } from 'next/navigation';
import { v4 } from 'uuid';

const ID_LENGTH = 8;

export default function Home() {
  const router = useRouter();

  const onCreateLobby = () => {
    const lobbyID = v4().slice(0, ID_LENGTH);
    router.push('/room/' + lobbyID);
  }

  return (
    <div className='app'>
      <div className='app-create-lobby' onClick={onCreateLobby}>
        Create Lobby
      </div>
    </div>
  )
}
