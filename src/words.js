const words = ["사과", "소다", "감자"];

const chooseWord = () => words[Math.floor(Math.random() * words.length)];

export default chooseWord;