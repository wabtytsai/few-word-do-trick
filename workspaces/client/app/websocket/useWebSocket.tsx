import { useState, useRef, useEffect, useCallback } from 'react';
import io, { Socket } from "socket.io-client";
import { ServerEvents } from '@shared/server/ServerEvents';
import { ClientEvents } from '@shared/client/ClientEvents';

export default function useWebSocket(socketURL: string, lobbyID: string) {
    const socketRef = useRef<Socket>(io(socketURL));
    const [words, setWords] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const socket = socketRef.current;
        const createOrJoinLobby = () => {
            socket.emit(ClientEvents.LobbyCreateOrJoin, { lobbyID })
        }

        socket.on(ServerEvents.GameMessage, data => {
            setMessage(data.message);
        });

        socket.on(ServerEvents.GameWordsUpdate, data => {
            setWords(data.words);
        })

        createOrJoinLobby();

        return () => {
            socket.removeAllListeners();
        };
    }, []);

    const leaveLobby = useCallback(() => {
        socketRef.current.emit(ClientEvents.LobbyLeave);
    }, []);

    const joinLobby = useCallback(() => {
        socketRef.current.emit(ClientEvents.LobbyJoin, { lobbyID });
    }, [lobbyID]);

    const getNewWords = useCallback(() => {
        socketRef.current.emit(ClientEvents.GameGetWords);
    }, []);

    return { 
        words,
        message,
        leaveLobby, 
        joinLobby, 
        getNewWords, 
    };
}