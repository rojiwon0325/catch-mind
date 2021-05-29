import Slider from "./slider";
import { getSocket } from "./sockets";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const controls = document.getElementById("jsControls");
const color = document.getElementById("jsColor");
const stroke = document.getElementById("jsStroke");
const remove = document.getElementById("jsRemove");
const save = document.getElementById("jsSave");
const slider = new Slider(stroke);


let painting = false;

const handlePainting = (e) => {
    if (e.type == "mousedown") {
        painting = true;
    } else if (e.type == "contextmenu") {
        painting = false;
        e.preventDefault();
    } else if (e.type == "mouseup") {
        painting = false;
    } else if (e.type == "mousemove") {
        const x = e.offsetX;
        const y = e.offsetY;
        if (!painting) {
            beginPath(x, y);
            getSocket().emit(window.events.beginPath, { x, y });
        } else {
            strokePath(x, y);
            getSocket().emit(window.events.strokePath, { x, y, color: ctx.strokeStyle, stroke: ctx.lineWidth });
        }
    } else if (e.type == "mouseenter") {
        if (painting) {
            beginPath(e.offsetX, e.offsetY);
        }
    } else if (e.type == "mouseover") {
        const x = e.offsetX;
        const y = e.offsetY;
        if (painting) {
            beginPath(x, y);
            strokePath(x, y);
            getSocket().emit(window.events.beginPath, { x, y });
            getSocket().emit(window.events.strokePath, { x, y, color: ctx.strokeStyle, stroke: ctx.lineWidth });
        } else {
            beginPath(x, y);
            getSocket().emit(window.events.beginPath, { x, y });
        }
    }
};

export const initCanvas = () => {
    ctx.strokeStyle = "##2c2d2d";
    ctx.lineWidth = 1;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    slider.init();
    stroke.addEventListener("change", () => {
        ctx.lineWidth = slider.value / 5;
    })
}

const beginPath = (x, y) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
}
const strokePath = (x, y, color = null, stroke = null) => {
    if (color != null) {
        ctx.strokeStyle = color;
    }
    if (stroke != null) {
        ctx.lineWidth = stroke;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
}

if (canvas) {
    if (color) {
        color.addEventListener("change", (e) => {
            ctx.strokeStyle = e.target.value;
        })
    }
    if (remove) {
        remove.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            getSocket().emit(window.events.clickRemove);
        });
    }
    if (save) {
        save.addEventListener("click", () => {
            const img = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = img;
            link.download = "CatchMind_img";
            link.click();
        });
    }
}
export const handleDrawCanvas = ({ img, id }) => {
    if (id == getSocket().id) {
        const image = new Image();
        image.src = img;
        image.onload = function () {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
    }
};

export const handleNewCanvas = (socket) => {
    const img = canvas.toDataURL("image/png");
    const { id } = socket;
    getSocket().emit(window.events.drawCanvas, { img, id });

};

export const handleAckBeginPath = ({ x, y }) => beginPath(x, y);

export const handleAckStrokePath = ({ x, y, color, stroke }) => strokePath(x, y, color, stroke);

export const handleClickRemove = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

export const enableCanvas = () => {
    controls.classList.remove("none");
    slider.init();
    canvas.addEventListener("mousedown", handlePainting);
    canvas.addEventListener("contextmenu", handlePainting);
    window.addEventListener("mouseup", handlePainting);
    canvas.addEventListener("mousemove", handlePainting);
    canvas.addEventListener("mouseenter", handlePainting);
    canvas.addEventListener("mouseover", handlePainting);
}

export const disableCanvas = () => {
    controls.classList.add("none");
    canvas.removeEventListener("mousedown", handlePainting);
    canvas.removeEventListener("contextmenu", handlePainting);
    window.removeEventListener("mouseup", handlePainting);
    canvas.removeEventListener("mousemove", handlePainting);
    canvas.removeEventListener("mouseenter", handlePainting);
    canvas.removeEventListener("mouseover", handlePainting);
};
