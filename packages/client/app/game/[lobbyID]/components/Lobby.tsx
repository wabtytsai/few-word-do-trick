'use client'

import { useParams } from 'next/navigation';

const LOBBY_PARAM = 'lobbyID';

export default function Lobby() {
    const params = useParams();

    return (
        <div className='lobby'>
            {params[LOBBY_PARAM]}
        </div>
    );
}