/* eslint-disable no-undef */
const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGIN = "logIn";
const LOGOUT = "logOut";

const nickname = localStorage.getItem(NICKNAME);

const logIn = (nickname) => {
    window.socket = io("/");
    window.socket.emit(window.events.setNickname, { nickname });
}

if (nickname === null) {
    body.className = LOGOUT;
} else {
    body.className = LOGIN;
    logIn(nickname);
}

const handleFormSubmit = (e) => {
    e.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    input.value = "";
    localStorage.setItem(NICKNAME, value);
    body.className = LOGIN;
    logIn(value);
}

if (loginForm) {
    loginForm.addEventListener("submit", handleFormSubmit);
}