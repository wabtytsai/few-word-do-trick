import { useState, useRef, useEffect, useCallback } from 'react';
import io, { Socket } from "socket.io-client";
import { ServerEvents } from '@shared/server/ServerEvents';
import { ClientEvents } from '@shared/client/ClientEvents';

export default function useWebSocket(socketURL: string, lobbyID: string) {
    const socketRef = useRef<Socket>(io(socketURL));
    const [words, setWords] = useState<string[]>([]);
    const [bid, setBid] = useState<number>(25);
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

        socket.on(ServerEvents.GameBidUpdate, data => {
            setBid(data.bidNumber);
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

    const updateBid = useCallback((bidNumber: number) => {
        socketRef.current.emit(ClientEvents.GameSetBid, { bidNumber });
    }, []);

    return { 
        message,
        leaveLobby, 
        joinLobby, 
        words,
        getNewWords, 
        bid,
        updateBid,
    };
}