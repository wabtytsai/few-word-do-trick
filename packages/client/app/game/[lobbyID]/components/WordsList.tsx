'use client'

import { useEffect, useState } from 'react';

import useFetchWordsSet from '../hooks/useFetchWordsSet';

const NUMBER_OF_WORDS = 5;

export default function WordsList() {
    const [words, setWords] = useState<Array<string>>([]);
    const [page, setPage] = useState(0);
    const [blur, setBlur] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await useFetchWordsSet();
            setWords(prev => [...prev, ...data]);
        }
        if (page >= words.length - NUMBER_OF_WORDS) {
            fetchData()
                .catch(console.error);
        }
    }, [page, words]);

    const toggleBlur = () => setBlur(prev => !prev);
    const onNextWords = () => {
        setBlur(true);
        setPage(prev => prev + NUMBER_OF_WORDS);
    }

    return (
        <div className='words-list'>
            <div className={`words-list-${blur ? 'spoiler' : 'reveal'}`} onClick={toggleBlur}>
                {words.slice(page, page + NUMBER_OF_WORDS).map(word => 
                    <div key={word}>{word}</div>
                )}
            </div>
            <div className='words-list-next' onClick={onNextWords}>Next</div>
        </div>
    )
}
