import { disableInput, enableInput } from "./chat";
import { fireNotif } from "./notifications";
import { disableCanvas, enableCanvas } from "./paint";
import { getSocket } from "./sockets";

const board = document.getElementById("jsPBoard");

const boardUpdate = (players) => players.forEach(player => {
    board.innerHTML = "";
    const pElem = document.createElement("span");
    pElem.innerText = `${player.nickname}: ${player.points}`;
    board.appendChild(pElem);
});
export const handlePlayerUpdate = ({ sockets }) => boardUpdate(sockets);

export const handleGameStart = ({ word, painter }) => {
    fireNotif("GAME START!", "rgba(0, 122, 255)");
    if (getSocket().id != painter.id) {
        disableCanvas();
        enableInput();
    } else {
        enableCanvas();
        disableInput();
    }
};

export const handleGameOver = () => {
    fireNotif("GAME OVER!", "rgba(255, 149, 0)");
    disableCanvas();
    enableInput();
};