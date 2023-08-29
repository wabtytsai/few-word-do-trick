'use client'

import { useEffect, useState } from 'react';
import { useSocket } from '@client/app/socket/SocketProvider';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

export default function WordsList() {
    const socket = useSocket();
    const [words, setWords] = useState<string[]>([]);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        socket.on(ServerEvents.GameWordsUpdate, data => {
            setWords(data.words);
        })
    }, []);

    const toggleHide = () => setIsHidden(prev => !prev);
    const onNextWords = () => {
        setIsHidden(true);
        socket.emit(ClientEvents.GameGetWords);
    }

    return (
        <div className='words-list'>
            <div className='words-list-container' onClick={toggleHide}>
                {isHidden ? 
                    <div className='words-list-reveal'>
                        Click to Reveal
                    </div> :
                    <div>{words.map((word, idx) =>
                        <div className='words-list-word' key={word + idx}>{word}</div>
                    )}</div>
                }
            </div>
            <div className='words-list-next' onClick={onNextWords}>Next</div>
        </div>
    )
}
