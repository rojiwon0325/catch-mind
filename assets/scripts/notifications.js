
const body = document.querySelector("body");
const notif_wrap = body.querySelector(".notification__wrap");

export const fireNotif = (text, color) => {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerText = text;
    notif.style.backgroundColor = color;
    notif_wrap.appendChild(notif);
    setTimeout(() => { notif_wrap.removeChild(notif) }, 3000);
}

export const handleNewUser = (socket) => {
    const { nickname } = socket;
    fireNotif(`${nickname} just joined`, "rgba(0, 122, 255)");
}

export const handleDisconnected = ({ nickname }) => {
    fireNotif(`${nickname} just left`, "rgba(255, 149, 0)");
}