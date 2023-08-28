'use client'
import React, { useState, useCallback, useEffect } from 'react';
import io, {Socket} from "socket.io-client";
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Server } from 'http';

const protocol = "http://"
const socketUrl = '127.0.0.1:4000/';

export const WebSocketDemo = () => {
    const [socket, setSocket] = useState<Socket>(io(protocol + socketUrl));
    const [messages, setMessages] = useState<string[]>([]);
    const [lobbyID, setLobbyID] = useState<string | null>(null);

    useEffect(() => {
        setSocket(socket);
        socket.on(ServerEvents.Pong, data => {
            console.log('receive');
            setMessages(prev => [data.message, ...prev]);
        });

        socket.on(ServerEvents.LobbyCreated, data => {
            setMessages(prev => [data.message, ...prev]);
            setLobbyID(data.lobbyID);
        });

        socket.on(ServerEvents.GameMessage, data => {
            setMessages(prev => [data.message, ...prev]);
        });

        return () => {
            socket.off(ServerEvents.Pong)
        };
    }, []);

    const sendMessage = () => {
        console.log('send message');
        socket.emit(ClientEvents.Ping);
    }

    const createLobby = () => {
        socket.emit(ClientEvents.LobbyCreate);
    }

    const leaveLobby = () => {
        socket.emit(ClientEvents.LobbyLeave);
    }

    const joinLobby = () => {
        socket.emit(ClientEvents.LobbyJoin, { lobbyID });
    }

    return (
        <div>
            <div>Hello WebSockets!</div>
            <div onClick={sendMessage}>Ping</div>
            {messages.map((message, idx) => <div key={idx}>{message}</div>)}
            <div onClick={createLobby}>Create Lobby</div>
            <div>{lobbyID}</div>
            <div onClick={leaveLobby}>Leave Lobby</div>
            <div onClick={joinLobby}>Join Lobby</div>
        </div>
    )
};