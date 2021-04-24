import { join } from "path";
import express from "express";
import socketIO from "socket.io";
import morgan from "morgan";

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", join(__dirname, "views")); // "./src/views" == join(__dirname, "views")
app.use(express.static(join(__dirname, "static")));
app.use(morgan("dev"));

app.get("/", (req, res) => res.render("home"));

const server = app.listen(PORT, () => {
    console.log(`✅ Listening on: http://localhost:${PORT}`);
});

const io = socketIO(server);

io.on("connection", (socket) => {
    socket.on("newMessage", ({ message }) => {
        socket.broadcast.emit("messageNotif", { message, nickname: socket.nickname || "Anonymous" });
    });
    socket.on("setNickname", ({ nickname }) => {
        socket.nickname = nickname;
    });
});
