const body = document.querySelector("body");

const fireNotif = (text, color) => {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.innerText = text;
    notif.style.backgroundColor = color;
    body.appendChild(notif);
    window.setTimeout(() => { body.removeChild(notif) }, 3000);
}

export const handleNewUser = ({ nickname }) => {
    fireNotif(`${nickname} just joined`, "rgba(0, 122, 255)");
}

export const handleDisconnected = ({ nickname }) => {
    fireNotif(`${nickname} just left`, "rgba(255, 149, 0)");
}