import events from "./events"
import chooseWord from "./words";

let sockets = [];

let play = false;
let painter = null;
let word = null;
let restart = null;
let gamestart = null;

const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)]

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    const gameStart = () => {
        if (!play && sockets.length > 1) {
            play = true;
            painter = choosePainter();
            word = chooseWord();
            io.emit(events.gameStart, ({ word, painter }));
            io.emit(events.newMsg, { message: "====GAME START!====", nickname: "manager" });
        }
        gamestart = null;
    }
    const gameOver = () => {
        if (play) {
            play = false;
            painter = null;
            word = null;
            io.emit(events.gameOver);
            io.emit(events.newMsg, { message: "====GAME OVER!====", nickname: "manager" });
            sockets.forEach(socket => { socket.points = 0 });
        }
    };
    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        sockets.push({ id: socket.id, points: 0, nickname });

        broadcast(events.newUser, { socket: sockets[sockets.length - 1] });
        io.emit(events.playerUpdate, { sockets });
        gamestart = setTimeout(() => gameStart(), 3000);
    });
    socket.on(events.disconnect, () => {
        sockets = sockets.filter(aSocket => socket.id !== aSocket.id);
        broadcast(events.disconnected, { nickname: socket.nickname });

        if (sockets.length == 1) {
            if (gamestart) {
                clearTimeout(gamestart);
                gamestart = null;
            }
            if (play) {
                gameOver();
            }
        }
        else if (play && painter.id == socket.id) {
            io.emit(events.newMsg, { message: `ANSWER is '${word}'!`, nickname: "manager" });
            painter = choosePainter();
            word = chooseWord();
            io.emit(events.gameStart, ({ word, painter }));
            io.emit(events.newMsg, { message: "====NEXT START!====", nickname: "manager" });
        }
        io.emit(events.playerUpdate, { sockets });
    });
    socket.on(events.sendMsg, ({ message }) => {
        if (message == word) {
            sockets.forEach(aSocket => {
                if (socket.id == aSocket.id) {
                    aSocket.points = aSocket.points + 1;
                    io.to(socket.id).emit(events.answer);
                    io.emit(events.playerUpdate, { sockets });
                    broadcast(events.newMsg, { message: "ANSWER!", nickname: socket.nickname });
                    if (!restart) {
                        restart = setTimeout(
                            () => {
                                painter = aSocket;
                                io.emit(events.newMsg, { message: `ANSWER is '${word}'!`, nickname: "manager" });
                                word = chooseWord();
                                io.emit(events.gameStart, ({ word, painter }));
                                io.emit(events.newMsg, { message: "====NEXT START!====", nickname: "manager" });
                                restart = null;
                            }, 3000);
                    }
                }
            });
        } else {
            broadcast(events.newMsg, { message, nickname: socket.nickname });
        }
    })
    socket.on(events.beginPath, ({ x, y }) =>
        broadcast(events.AckBeginPath, { x, y })
    );
    socket.on(events.strokePath, ({ x, y, color, stroke }) =>
        broadcast(events.AckStrokePath, { x, y, color, stroke })
    );
    socket.on(events.clickRemove, () => broadcast(events.clickRemove));
    socket.on(events.drawCanvas, ({ img, id }) => broadcast(events.drawCanvas, { img, id }));
};

setInterval(() => console.log(sockets), 5000);

export default socketController;