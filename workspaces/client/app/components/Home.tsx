'use client'

import { Button, Input, Text, Title } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useSocket } from '../contexts/socket-context';
import { ServerEvents } from '@shared/server/ServerEvents';
import { useEffect, useState } from 'react';
import { ClientEvents } from '@shared/client/ClientEvents';

const SIZE = 'sm';

export default function Lobby() {
    const router = useRouter();
    const socket = useSocket();
    const [name, setName] = useState<string>('');
    const [lobbyID, setLobbyID] = useState<string>('');

    useEffect(() => {
        socket.on(ServerEvents.LobbyCreated, data => {
            const { lobbyID } = data;
            router.push('/room/' + lobbyID);
        });
    }, [socket, router]);

    const onCreateLobby = () => {
        socket.emit(ClientEvents.LobbyCreate, { name });
    }

    const onJoinLobby = () => {
        router.push('/room/' + lobbyID);
    }

    return (
        <div className='home'>
            <Title order={1} className='home-title'>
                Few Word Do Trick
            </Title>
            <Input
                className='name-input'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                radius='xl'
                size={SIZE} />
            <Input
                className='lobby-id-input'
                value={lobbyID}
                onChange={e => setLobbyID(e.target.value)}
                placeholder="Enter room id (if joining)"
                radius='xl'
                size={SIZE} />
            <div className='home-buttons'>
                <Button
                    className='create-lobby-button'
                    onClick={onCreateLobby}
                    color="dark"
                    radius="xl"
                    size={SIZE}
                    disabled={name.length < 2}
                >
                    New Lobby
                </Button>
                <Button
                    className='join-lobby-button'
                    onClick={onJoinLobby}
                    variant='default'
                    color="dark"
                    radius="xl"
                    size={SIZE}
                    disabled={name.length < 2 || lobbyID.length !== 8}
                >
                    Join Lobby
                </Button>
            </div>
        </div>
    )
}