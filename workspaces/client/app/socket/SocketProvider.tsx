import { createContext, ReactNode, useContext } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;
console.log(SOCKET_URL);
const ws = io(SOCKET_URL);

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