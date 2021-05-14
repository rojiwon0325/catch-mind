import events from "./events"
import chooseWord from "./words";

let sockets = [];

let play = false;
let painter = null;
let word = null;

const choosePainter = () => sockets[Math.floor(Math.random() * sockets.length)]

const socketController = (socket, io) => {
    const broadcast = (event, data) => socket.broadcast.emit(event, data);
    const gameStart = () => {
        if (!play && sockets.length > 1) {
            play = true;
            painter = choosePainter();
            word = chooseWord();
            io.emit(events.gameStart, ({ word, painter }));
        }
    }
    const gameOver = () => {
        if (play) {
            play = false;
            painter = null;
            word = null;
            io.emit(events.gameOver);
        }
    };
    socket.on(events.setNickname, ({ nickname }) => {
        socket.nickname = nickname;
        sockets.push({ id: socket.id, points: 0, nickname });

        broadcast(events.newUser, { socket: sockets[sockets.length - 1] });
        io.emit(events.playerUpdate, { sockets });
        setTimeout(() => gameStart(), 3000);
    });
    socket.on(events.disconnect, () => {
        sockets = sockets.filter(aSocket => socket.id !== aSocket.id);
        broadcast(events.disconnected, { nickname: socket.nickname });

        if (play && painter.id == socket.id) {
            play = false;
            setTimeout(() => gameStart(), 3000);
        } else if (play && sockets.length == 1) {
            gameOver();
        }
        io.emit(events.playerUpdate, { sockets });
    });
    socket.on(events.sendMsg, ({ message }) => {
        broadcast(events.newMsg, { message, nickname: socket.nickname });
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