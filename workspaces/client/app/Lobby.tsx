'use client'

import { Button } from '@mantine/core';
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
        <div className='landing'>
            <Button
                className='create-lobby-button'
                onClick={onCreateLobby}
                color="indigo"
                radius="md"
                size="xs"
            >
                Create Lobby
            </Button>
            <Button
                className='join-lobby-button'
                onClick={onJoinLobby}
                color="indigo"
                radius="md"
                size="xs"
            >
                Join Lobby
            </Button>
            <input
                className='join-lobby-input'
                value={lobbyID}
                onChange={e => setLobbyID(e.target.value)}
                placeholder="lobby id" />
        </div>
    )
}