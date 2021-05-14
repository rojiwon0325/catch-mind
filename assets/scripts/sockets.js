import { handleNewMessage } from "./chat";
import { handleDisconnected, handleNewUser } from "./notifications";
import { handleAckBeginPath, handleAckStrokePath, handleClickRemove, handleDrawCanvas, handleNewCanvas } from "./paint";
import { handleGameStart, handleGameOver, handlePlayerUpdate } from "./players";

let socket = null;

export const getSocket = () => socket;

export const updateSocket = (aSocket) => (socket = aSocket);


export const initSockets = (aSocket) => {
    const { events } = window;
    updateSocket(aSocket);
    aSocket.on(events.newUser, ({ socket }) => { handleNewUser(socket), handleNewCanvas(socket) });
    aSocket.on(events.disconnected, handleDisconnected);
    aSocket.on(events.newMsg, handleNewMessage);
    aSocket.on(events.AckBeginPath, handleAckBeginPath);
    aSocket.on(events.AckStrokePath, handleAckStrokePath);
    aSocket.on(events.clickRemove, handleClickRemove);
    aSocket.on(events.drawCanvas, handleDrawCanvas);
    aSocket.on(events.playerUpdate, handlePlayerUpdate);
    aSocket.on(events.gameStart, handleGameStart);
    aSocket.on(events.gameOver, () => { handleGameOver(), handleClickRemove() });
}
