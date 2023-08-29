import { createContext, ReactNode, useContext } from "react";
import io, { Socket } from "socket.io-client";

const PROTOCOL = "http://"
const SOCKET_URL = '127.0.0.1:4000/';
const ws = io(PROTOCOL+SOCKET_URL);

const SocketContext = createContext(ws);

type Props = {
    children: ReactNode,
}

export const SocketProvider = ({ children }: Props) => (
  <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
  }