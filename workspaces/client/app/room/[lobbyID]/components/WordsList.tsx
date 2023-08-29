'use client'

import { useEffect, useState } from 'react';
import { useSocket } from '@client/app/socket/SocketProvider';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

export default function WordsList() {
    const socket = useSocket();
    const [words, setWords] = useState<string[]>([]);
    const [blur, setBlur] = useState(true);

    useEffect(() => {
        socket.on(ServerEvents.GameWordsUpdate, data => {
            setWords(data.words);
        })
    }, []);

    const toggleBlur = () => setBlur(prev => !prev);
    const onNextWords = () => {
        setBlur(true);
        socket.emit(ClientEvents.GameGetWords);
    }

    return (
        <div className='words-list'>
            <div className={`words-list-${blur ? 'spoiler' : 'reveal'}`} onClick={toggleBlur}>
                {words.map((word,idx) => 
                    <div className='words-list-word' key={word+idx}>{word}</div>
                )}
            </div>
            <div className='words-list-next' onClick={onNextWords}>Next</div>
        </div>
    )
}
