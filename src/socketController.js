import events from "./events"
import chooseWord from "./words";

let sockets = [];
let watchers = [];

let play = false;
let painter = null;
let word = null;
let gamestart = null;
let round = 0;
let time = null;
let count = null;
const playerlimit = 6;

const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    const gameStart = () => {
        if (!play && sockets.length > 1) {
            play = true;
            painter = choosePainter();
            word = chooseWord();
            io.emit(events.gameStart, ({ word, painter }));
            io.emit(events.playerUpdate, { sockets });
            io.emit(events.newMsg, { message: "====GAME START!====", nickname: "manager" });
            io.emit(events.newMsg, { message: " ====ROUND 1====", nickname: "manager" });
            round = 1;
            timeLimit(20);
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
            io.emit(events.newMsg, { message: "=====SCORE=====", nickname: "manager" });
            sockets.forEach(socket => {
                io.emit(events.newMsg, { message: `${socket.nickname}: ${socket.points} points`, nickname: "manager" });
            });
            sockets.forEach(socket => { socket.points = 0 });
            round = 0;
            if (time) {
                clearTimeout(time);
                time = null;
            }
            if (gamestart) {
                clearTimeout(gamestart);
                gamestart = null;
            }
            if (count) {
                clearTimeout(count);
                count = null;
            }
            gamestart = setTimeout(() => gameStart(), 10000);
        }
    };
    const countDown = (n, newPainter) => {
        if (!count) {
            count = setTimeout(() => {
                count = null;
                painter = newPainter ? newPainter : choosePainter();
                io.emit(events.newMsg, { message: `ANSWER is '${word}'!`, nickname: "manager" });
                if (round < 3) {
                    round = round + 1;
                    word = chooseWord();
                    io.emit(events.gameStart, ({ word, painter }));
                    io.emit(events.clickRemove);
                    io.emit(events.newMsg, { message: `====ROUND ${round}====`, nickname: "manager" });
                    timeLimit(20);
                } else {
                    gameOver();
                }
            }, n * 1000);
        }
    };
    const timeLimit = (n) => {
        time = setTimeout(() => {
            if (!count) {
                count = countDown(10);
            }
            time = null;
        }, n * 1000);
    };
    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        if (playerlimit <= sockets.length) {
            watchers.push({ id: socket.id, points: 0, nickname });
            broadcast(events.newUser, { socket: watchers[watchers.length - 1] });
            io.emit(events.playerUpdate, { sockets });
            io.emit(events.newMsg, { message: "I'm watching!", nickname });
        } else {
            sockets.push({ id: socket.id, points: 0, nickname });
            broadcast(events.newUser, { socket: sockets[sockets.length - 1] });
            io.emit(events.playerUpdate, { sockets });
            gamestart = setTimeout(() => gameStart(), 3000);
        }
    });
    socket.on(events.disconnect, () => {
        sockets = sockets.filter(aSocket => socket.id !== aSocket.id);
        watchers = watchers.filter(aSocket => socket.id !== aSocket.id);
        broadcast(events.disconnected, { nickname: socket.nickname });
        while (sockets.length < playerlimit && watchers.length >= 1) {
            sockets.push(watchers.shift());
            io.emit(events.playerUpdate, { sockets });
        }
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
            io.emit(events.newMsg, { message: "====RESTART!====", nickname: "manager" });
            if (time) {
                clearTimeout(time);
                time = null;
            }
            if (count) {
                clearTimeout(count);
                count = null;
            }
            timeLimit(20);
        }
        io.emit(events.playerUpdate, { sockets });
    });
    socket.on(events.sendMsg, ({ message }) => {
        let flag = false;
        sockets.forEach((aSocket) => {
            if (socket.id == aSocket.id) {
                flag = true;
                if (message == word) {
                    if (time) {
                        clearTimeout(time);
                        time = null;
                    }
                    aSocket.points = aSocket.points + 1;
                    io.to(socket.id).emit(events.answer);
                    io.emit(events.playerUpdate, { sockets });
                    broadcast(events.newMsg, { message: "ANSWER!", nickname: socket.nickname });
                    countDown(10, aSocket);
                } else {
                    broadcast(events.newMsg, { message, nickname: socket.nickname });
                }
            }
        });
        if (!flag && !play) {
            broadcast(events.newMsg, { message, nickname: socket.nickname });
        }
    });
    socket.on(events.beginPath, ({ x, y }) =>
        broadcast(events.AckBeginPath, { x, y })
    );
    socket.on(events.strokePath, ({ x, y, color, stroke }) =>
        broadcast(events.AckStrokePath, { x, y, color, stroke })
    );
    socket.on(events.clickRemove, () => broadcast(events.clickRemove));
    socket.on(events.drawCanvas, ({ img, id }) => broadcast(events.drawCanvas, { img, id }));
};

setInterval(() => {
    console.log(sockets);
    console.log(watchers);
}, 5000);

export default socketController;