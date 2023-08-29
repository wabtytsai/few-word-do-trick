'use client'

import { 
    AiFillMinusCircle, 
    AiFillPlusCircle
} from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Slider } from '@mantine/core';
import { useSocket } from '@client/app/socket/SocketProvider';
import { ServerEvents } from '@shared/server/ServerEvents';
import { ClientEvents } from '@shared/client/ClientEvents';

const STARTING_BID = 25;

const marks = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

export default function BidTracker() {
    const socket = useSocket();
    const [bid, setBid] = useState<number>(25);

    useEffect(() => {
        socket.on(ServerEvents.GameBidUpdate, data => {
            setBid(data.bid);
        });
    }, []);

    const updateBid = (bid: number) => {
        socket.emit(ClientEvents.GameSetBid, { bid })
    }

    const increment = () => updateBid(bid + 1);

    const decrement = () => updateBid(bid - 1);

    return (
        <div className="bid-tracker">
            <div className='bid-tracker-minus' onClick={decrement}>
                <AiFillMinusCircle />
            </div>
            <div className='bid-tracker-bid-container'>
                <div className='bid-tracker-bid'>{bid}</div>
                <div className='bid-tracker-slider'>
                    <Slider 
                        value={bid}
                        onChange={updateBid}
                        label={null}
                        size="sm"
                        max={STARTING_BID}
                        min={0}
                        marks={marks} />
                </div>
            </div>
            <div className='bid-tracker-plus' onClick={increment}>
                <AiFillPlusCircle />
            </div>
        </div>
    )
}
