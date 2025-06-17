import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Create a context to store the socket connection, defaults to null until connection established
const SocketContext = createContext<Socket | null>(null);

// Create custom hook to allow any component to easily access the socket
export const useSocket = () => {
  return useContext(SocketContext);
};

// Set up the socketProvider component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // create state variable to store the WebSocket connection
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const backendUrl =
      import.meta.env.MODE === "production"
        ? "https://quiz-mania-backend.onrender.com"
        : "http://localhost:5002";

    const newSocket = io(backendUrl);

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
