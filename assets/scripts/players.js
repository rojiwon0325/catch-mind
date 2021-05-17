import { disableInput, enableInput } from "./chat";
import { fireNotif } from "./notifications";
import { disableCanvas, enableCanvas } from "./paint";
import { getSocket } from "./sockets";

const board = document.getElementById("jsPBoard");
const answer = document.getElementById("jsWord");

const boardUpdate = (players) => {
    board.innerHTML = "";
    players.forEach(player => {
        const pElem = document.createElement("span");
        pElem.innerText = `${player.nickname}: ${player.points}`;
        board.appendChild(pElem);
    })
};
export const handlePlayerUpdate = ({ sockets }) => boardUpdate(sockets);

export const handleGameStart = ({ word, painter }) => {
    fireNotif("GAME START!", "rgb(0, 122, 255)");
    if (getSocket().id != painter.id) {
        answer.innerText = "";
        answer.classList.add("none");
        disableCanvas();
        enableInput();
    } else {
        answer.innerText = word;
        answer.classList.remove("none");
        enableCanvas();
        disableInput();
    }
};

export const handleGameOver = () => {
    fireNotif("GAME OVER!", "rgb(255, 149, 0)");
    answer.classList.add("none");
    disableCanvas();
    enableInput();
};

export const handleAnswer = () => {
    disableInput();
    fireNotif("ANSWER!", "rgb(90, 200, 250)");
};