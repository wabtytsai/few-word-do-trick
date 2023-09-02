'use client'

import { useRouter } from 'next/navigation';
import { useSocket } from './socket/SocketProvider';
import { ServerEvents } from '@shared/server/ServerEvents';
import { useEffect, useState } from 'react';
import { ClientEvents } from '@shared/client/ClientEvents';

export default function Lobby() {
    const router = useRouter();
    const socket = useSocket();
    const [lobbyID, setLobbyID] = useState<string>('');

    useEffect(() => {
        socket.on(ServerEvents.LobbyCreated, data => {
            const { lobbyID } = data;
            router.push('/room/' + lobbyID);
        });

        socket.on(ServerEvents.LobbyJoined, data => {
            const { lobbyID } = data;
            router.push('/room/' + lobbyID);
        });
    }, [socket, router]);

    const onCreateLobby = () => {
        console.log('create lobby');
        socket.emit(ClientEvents.LobbyCreate);
    }

    const onJoinLobby = () => {
        router.push('/room/' + lobbyID);
        
    }

    return (
        <div>
            <div className='app-create-lobby' onClick={onCreateLobby}>
                Create Lobby
            </div>
            <div>
                <input value={lobbyID} onChange={e => setLobbyID(e.target.value)} />
                <span onClick={onJoinLobby}>Join Lobby</span>
            </div>
        </div>
    )
}