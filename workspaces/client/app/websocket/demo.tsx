'use client'
import React, { useState, useCallback, useEffect } from 'react';
import io, { Socket } from "socket.io-client";
import { ClientEvents } from '@shared/client/ClientEvents';
import { ServerEvents } from '@shared/server/ServerEvents';
import { Server } from 'http';

const protocol = "http://"
const socketUrl = '127.0.0.1:4000/';

export const WebSocketDemo = () => {
    const [socket, setSocket] = useState<Socket>(io(protocol + socketUrl));
    const [messages, setMessages] = useState<string[]>([]);
    const [lobbyID, setLobbyID] = useState<string>('');
    const [words, setWords] = useState<string[]>([]);

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

        socket.on(ServerEvents.GameWordsUpdate, data => {
            setWords(data.words);
        })

        return () => {
            socket.removeAllListeners();
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

    const getNewWords = () => {
        socket.emit(ClientEvents.GameGetWords);
    }

    return (
        <div>
            <div>Hello WebSockets!</div>
            <div onClick={sendMessage}>Ping</div>
            {messages.map((message, idx) => <div key={idx}>{message}</div>)}
            <div onClick={createLobby}>Create Lobby</div>
            <input value={lobbyID} onChange={(e) => setLobbyID(e.target.value)} />
            <div onClick={joinLobby}>Join Lobby</div>
            {lobbyID != '' ? <div>
                <div onClick={leaveLobby}>Leave Lobby</div>
                <div>Words:</div>
                {words.map(word => <div>{word}</div>)}
                <div onClick={getNewWords}>Get new words</div>
            </div> : <div />}
        </div>
    )
};