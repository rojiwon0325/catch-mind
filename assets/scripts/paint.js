const body = document.querySelector("body");
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

export const initCanvas = () => {
    ctx.strokeStyle = "##2c2d2d";
    ctx.lineWidth = 2.5;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

let painting = false;
if (canvas) {
    canvas.addEventListener("mousedown", () => {
        painting = true;
    });
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
}