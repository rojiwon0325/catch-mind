import Slider from "./slider";

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("jsColor");
const stroke = document.getElementById("jsStroke");
const remove = document.getElementById("jsRemove");
const save = document.getElementById("jsSave");
const slider = new Slider(stroke);

let painting = false;

export const initCanvas = () => {
    ctx.strokeStyle = "##2c2d2d";
    ctx.lineWidth = 1;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    canvas.fillStyle = "rgba(0, 0, 0, 0)";
    color(0, 0, 0, 0);
    canvas.fillRect(0, 0, canvas.width, canvas.height);
    slider.init();
    stroke.addEventListener("change", (e) => {
        ctx.lineWidth = slider.value / 5;
    })
}


if (canvas) {
    canvas.addEventListener("mousedown", () => {
        painting = true;
    });
    canvas.addEventListener("contextmenu", (e) => {
        painting = false;
        e.preventDefault();
    })
    window.addEventListener("mouseup", () => {
        painting = false;
    });
    canvas.addEventListener("mousemove", (e) => {
        if (!painting) {
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        } else {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();
        }
    });
    canvas.addEventListener("mouseenter", (e) => {
        if (painting) {
            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    });
    if (color) {
        color.addEventListener("change", (e) => {
            ctx.strokeStyle = e.target.value;
        })
    }
    if (remove) {
        remove.addEventListener("click", () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }
    if (save) {
        save.addEventListener("click", (e) => {
            const img = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = img;
            link.download = "CatchMind_img";
            link.click();
        });
    }
}