'use client'

import { useState } from 'react';

type Props = {
    words: Array<string>,
};

export default function WordsList({ words }: Props) {
    const [blur, setBlur] = useState(true);

    const toggleBlur = () => setBlur(prev => !prev);

    return (
        <div className={`words-list ${blur ? 'spoiler' : ''}`} onClick={toggleBlur}>
            {words.map(word => 
                <div key={word}>{word}</div>
            )}
        </div>
    )
}
