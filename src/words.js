const words = [];

const chooseWord = () => words[Math.floor(Math.random() * words.length)];

export default chooseWord;