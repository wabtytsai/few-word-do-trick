'use client'
import React, { useState, useCallback, useEffect } from 'react';
import io, {Socket} from "socket.io-client";
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';

const protocol = "http://"
const socketUrl = '127.0.0.1:4000/';

export const WebSocketDemo = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        const socket = io(protocol + socketUrl);
        setSocket(socket);
        socket.on(ServerEvents.Pong, data => {
            console.log('receive');
            setMessages(prev => [...prev, data.message]);
        });

        return () => {
            socket.off(ServerEvents.Pong)
        };
    }, []);

    const sendMessage = () => {
        console.log('send message');
        socket?.emit(ClientEvents.Ping);
    }

    return (
        <div>
            <div onClick={sendMessage}>Hello WebSockets!</div>
            {messages.map(message => <div key={message}>{message}</div>)}
        </div>
    )
};