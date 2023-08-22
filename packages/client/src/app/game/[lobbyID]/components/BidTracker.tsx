'use client'
import { useState } from 'react';

const STARTING_BID = 25;

export default function BidTracker() {
    const [bid, setBid] = useState(STARTING_BID);

    const increment = () => setBid(prev => prev < 25 ? prev + 1 : prev);

    const decrement = () => setBid(prev => prev > 0 ? prev - 1 : prev);

    return (
        <div className="bid-tracker">
            <div className='bid-tracker-minus' onClick={decrement}>-</div>
            <div className='bid-tracker-bid-container'>
                <div className='bid-tracker-bid'>{bid}</div>
                <div className='bid-tracker-slider'>Slider</div>
            </div>
            <div className='bid-tracker-plus' onClick={increment}>+</div>
        </div>
    )
}
