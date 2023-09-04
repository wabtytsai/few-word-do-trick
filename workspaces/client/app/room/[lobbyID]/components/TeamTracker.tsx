'use client'

import { useSocket } from '@client/app/contexts/socket-context';
import { ClientEvents } from '@shared/client/ClientEvents';
import { useEffect, useState } from 'react';
import { RoomTeams } from '@shared/common/RoomTeams';

type Props = {
    members: string[],
    roomTeam: RoomTeams,
}

export default function TeamTracker({ members }: Props) {
    const socket = useSocket();
    const [points, setPoints] = useState(0);

    const onScore = () => setPoints(prev => prev + 1);

    return (
        <div className='team-tracker'>
            <div className="team-tracker-members">
                {members.map(member =>
                    <div key={member}>{member}</div>
                )}
            </div>
                <div className='team-tracker-points'>Points: {points}</div>
                <div className='team-tracker-score' onClick={onScore}>Score</div>
        </div>
    )
}
