'use client'

import { Button, Text, Paper } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSocket } from '@client/app/contexts/socket-context';
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

export default function WordsList() {
    const socket = useSocket();
    const [words, setWords] = useState<string[]>([]);
    const [isHidden, setIsHidden] = useState(true);

    useEffect(() => {
        socket.on(ServerEvents.GameWordsUpdate, data => {
            setIsHidden(true);
            setWords(data.words);
        })
    }, [socket]);

    const toggleHide = () => setIsHidden(prev => !prev);
    const onNextWords = () => {
        setIsHidden(true);
        socket.emit(ClientEvents.GameGetWords);
    }

    return (
        <div className='words-list'>
            <div className='words-list-container' onClick={toggleHide}>
                <Paper shadow="md" radius="md" p="md">
                    {isHidden ?
                        <Text>Click to Reveal</Text>
                        :
                        <>{words.map((word, idx) =>
                            <Text className='words-list-word' key={word + idx}>{word}</Text>
                        )}</>
                    }
                </Paper>
            </div>
            <div className='words-list-next' onClick={onNextWords}>
                <Button variant="light" radius="xl" size="sm">Next</Button>
            </div>
        </div>
    )
}
