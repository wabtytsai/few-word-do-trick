'use client'

import { useEffect, useState } from 'react';

import fetchWordsSet from '../utils/fetchWordsSet';

const NUMBER_OF_WORDS = 5;

type Props = {
    words: string[],
    getNewWords: () => void,
}

export default function WordsList({ words, getNewWords }: Props) {
    const [blur, setBlur] = useState(true);

    const toggleBlur = () => setBlur(prev => !prev);
    const onNextWords = () => {
        setBlur(true);
        getNewWords();
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
