'use client'
import { useState } from 'react';
import { Slider } from '@mantine/core';

const STARTING_BID = 25;

const marks = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 15, label: '15' },
    { value: 20, label: '20' },
  ];

type Props = {
    bid: number,
    updateBid: (bid: number) => void,
}

export default function BidTracker({ bid, updateBid }: Props) {

    const increment = () => updateBid(bid + 1);

    const decrement = () => updateBid(bid - 1);

    return (
        <div className="bid-tracker">
            <div className='bid-tracker-minus' onClick={decrement}>-</div>
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
            <div className='bid-tracker-plus' onClick={increment}>+</div>
        </div>
    )
}
