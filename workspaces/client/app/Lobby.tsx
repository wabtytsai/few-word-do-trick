'use client'

import { useRouter } from 'next/navigation';
import { useSocket } from './socket/SocketProvider';
import { ServerEvents } from '@shared/server/ServerEvents';
import { useEffect } from 'react';
import { ClientEvents } from '@shared/client/ClientEvents';

export default function Lobby() {
    const router = useRouter();
    const socket = useSocket();

    useEffect(() => {
        socket.on(ServerEvents.LobbyCreated, data => {
            const { lobbyID } = data;
            router.push('/room/' + lobbyID);
        });
    }, []);

    const onCreateLobby = () => {
        socket.emit(ClientEvents.LobbyCreate);
    }

    return (
        <div className='app-create-lobby' onClick={onCreateLobby}>
          Create Lobby
        </div>
    )
}