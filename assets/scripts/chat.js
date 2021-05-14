import { getSocket } from "./sockets";

const messages = document.getElementById("jsMessages");
const sendMsg = document.getElementById("jsSendMsg");

const appendMsg = (text, nickname) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="author ${nickname ? "out" : "self"}">${nickname ? nickname : "You"}: </span>${text}`;
    messages.appendChild(li);
    li.scrollIntoView({ behavior: "smooth" });
};

const handleSendMsg = (event) => {
    event.preventDefault();
    const input = sendMsg.querySelector("input");
    const { value } = input;
    getSocket().emit(window.events.sendMsg, { message: value });
    input.value = "";
    appendMsg(value);
};

export const handleNewMessage = ({ message, nickname }) =>
    appendMsg(message, nickname);

export const enableInput = () => {
    sendMsg.classList.remove("none");
};
export const disableInput = () => {
    sendMsg.classList.add("none");
};

if (sendMsg) {
    sendMsg.addEventListener("submit", handleSendMsg);
}