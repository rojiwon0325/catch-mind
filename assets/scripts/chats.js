export function handle(data) {
    const { message, nickname } = data;
    console.log(`${nickname}: ${message}`)
};