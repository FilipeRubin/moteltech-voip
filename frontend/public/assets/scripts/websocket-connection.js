let serverIp = '179.219.53.172';
let serverPort = '12501';
const address = `ws://${serverIp}:${serverPort}`;

export const socket = new WebSocket(address);

socket.onopen = function () {
    console.log('Conectado ao servidor WebSocket!');
    socket.send(JSON.stringify({ type: "registration", data: "suite" }));
};

socket.onmessage = function (event) {
    console.log('Mensagem recebida:', event.data);
};

socket.onclose = function (event) {
    console.log('Conexão encerrada:', event);
};

socket.onerror = function (error) {
    console.error('Erro:', error);
};


