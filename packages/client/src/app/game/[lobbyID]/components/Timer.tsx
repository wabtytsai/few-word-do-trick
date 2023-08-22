'use client' 

import { useCallback, useEffect, useState } from 'react';

const TICK_IN_MS = 1000;

export default function Timer() {
    const [timer, setTimer] = useState(45);
    const [running, setRunning] = useState(false);

    const tick = useCallback(() => {
        if (!running) {
            return;
        }
        setTimer(prev => {
            if (prev == 0) {
                setRunning(false);
                return 0;
            } else {
                return prev - 1;
            }
        });
    }, [running]);

    // Count down in 1000 ms interval
    useEffect(() => {
        const id = setInterval(tick, TICK_IN_MS);
        return () => clearInterval(id);
    }, [tick]);

    const resetTimer = () => {
        setTimer(45);
        setRunning(false);
    }
    const toggleTimer = () => setRunning(prev => !prev);

    return (
        <div className='timer-container'>
            <div className='timer'>{timer}</div>
            <div className='timer-start-pause' onClick={toggleTimer}>
                {running ? "pause" : "start"}
            </div>
            <div className='timer-reset' onClick={resetTimer}>reset</div>
        </div>
    );
}