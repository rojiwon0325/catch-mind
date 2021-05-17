
const body = document.querySelector("body");
const notif_container = body.querySelector(".notification__container");

export const fireNotif = (text, color) => {
    const div = document.createElement("div");
    div.className = "notification__wrap";
    const notif = document.createElement("span");
    notif.className = "notification";
    notif.innerText = text;
    notif.style.backgroundColor = color;
    notif_container.appendChild(div);
    div.appendChild(notif);
    setTimeout(() => { notif_container.removeChild(div) }, 3000);
}

export const handleNewUser = (socket) => {
    const { nickname } = socket;
    fireNotif(`${nickname} just joined`, "rgba(0, 122, 255)");
}

export const handleDisconnected = ({ nickname }) => {
    fireNotif(`${nickname} just left`, "rgba(255, 149, 0)");
}