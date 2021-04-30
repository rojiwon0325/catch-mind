import { handleNewMessage } from "./chat";
import { handleDisconnected, handleNewUser } from "./notifications";

let socket = null;

export const getSocket = () => socket;

export const updateSocket = (aSocket) => (socket = aSocket);


export const initSockets = (aSocket) => {
    const { events } = window;
    updateSocket(aSocket);
    aSocket.on(events.newUser, handleNewUser);
    aSocket.on(events.disconnected, handleDisconnected);
    aSocket.on(events.newMsg, handleNewMessage);
}