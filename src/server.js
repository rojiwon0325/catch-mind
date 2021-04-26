import path from "path";
import express from "express";
import socketIO from "socket.io";
import morgan from "morgan";
import socketController from "./socketController";
import events from "./events";

const PORT = 4000;
const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // "./src/views" == join(__dirname, "views")
app.use(express.static(path.join(__dirname, "static")));
app.use(morgan("dev"));

app.get("/", (req, res) => res.render("home", { events: JSON.stringify(events) }));

const server = app.listen(PORT, () => {
    console.log(`✅ Listening on: http://localhost:${PORT}`);
});

const io = socketIO(server);


io.on("connection", socket => socketController(socket));
