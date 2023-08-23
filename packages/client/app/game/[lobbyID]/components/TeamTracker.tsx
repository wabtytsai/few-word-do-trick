'use client'

import { useState } from 'react';

type Props = {
    members: Array<string>,
};

export default function TeamTracker({ members }: Props) {
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
