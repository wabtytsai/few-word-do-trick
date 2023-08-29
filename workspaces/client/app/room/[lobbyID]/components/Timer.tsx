'use client' 

import { 
    BsFillPauseCircleFill, 
    BsFillPlayCircleFill,
    BsFillStopCircleFill,
} from 'react-icons/bs';
import { useSocket } from '@client/app/socket/SocketProvider';
import { ServerEvents } from '@shared/server/ServerEvents';
import { TimerEvents } from '@shared/common/TimerEvents';
import { useCallback, useEffect, useState } from 'react';
import { ClientEvents } from '@shared/client/ClientEvents';

const TICK_IN_MS = 1000;
const DEFAULT_TIME = 45;

export default function Timer() {
    const socket = useSocket();
    const [timer, setTimer] = useState(DEFAULT_TIME);
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

    useEffect(() => {
        socket.on(ServerEvents.GameTimerUpdate, data => {
            const event: TimerEvents = data.event;
            switch (event) {
                case TimerEvents.Start: {
                    setRunning(true);
                    break;
                }
                case TimerEvents.Pause: {
                    setRunning(false);
                    break;
                }
                case TimerEvents.Reset: {
                    setRunning(false);
                    setTimer(DEFAULT_TIME);
                    break;
                }
            }
        });
    }, []);

    const resetTimer = () => {
        socket.emit(ClientEvents.GameUpdateTimer, {
            event: TimerEvents.Reset,
        });
        setRunning(false);
        setTimer(DEFAULT_TIME);
    };

    const toggleTimer = () => {
        socket.emit(ClientEvents.GameUpdateTimer, {
            event: running ? TimerEvents.Pause : TimerEvents.Start,
        });
        setRunning(prev => !prev);
    };

    return (
        <div className='timer-container'>
            <div className='timer'>{timer}s</div>
            <div className='timer-start-pause' onClick={toggleTimer}>
                {running ? <BsFillPauseCircleFill size={24} /> : <BsFillPlayCircleFill size={24} />}
            </div>
            <div className='timer-reset' onClick={resetTimer}>
                <BsFillStopCircleFill size={24} />
            </div>
        </div>
    );
}