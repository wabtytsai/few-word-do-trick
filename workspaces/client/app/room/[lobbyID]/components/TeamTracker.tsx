'use client'

import { useSocket } from '@client/app/contexts/socket-context';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useEffect, useState } from 'react';
import { RoomTeams } from '@shared/common/RoomTeams';
import { Button, Title } from '@mantine/core';

type Props = {
    members: string[],
    roomTeam: RoomTeams,
}

export default function TeamTracker({ members, roomTeam }: Props) {
    const socket = useSocket();
    const [points, setPoints] = useState(0);

    const onScore = () => setPoints(prev => prev + 1);
    const onJoin = () => {
        socket.emit(ClientEvents.GameJoinTeam, { roomTeam });
    };

    return (
        <div className='team-tracker'>
            <Title order={5} className='team-name'>{roomTeam}</Title>
            <Button
                className='team-join-button'
                onClick={onJoin}
                variant='outline'
                color="dark"
                radius="xl"
                size="xs"
            >
                Join
            </Button>
            <div className="team-members">
                {members.map(member =>
                    <div key={member}>{member}</div>
                )}
            </div>
            <div className='team-points'>Points: {points}</div>
            <Button
                className='team-score-button'
                onClick={onScore}
                variant='outline'
                color="dark"
                radius="xl"
                size="xs"
            >
                Score
            </Button>
        </div>
    )
}
