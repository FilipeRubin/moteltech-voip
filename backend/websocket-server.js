const WebSocket = require('ws');
const Users = require('./users');
const webSocketServer = new WebSocket.Server({ port: 12501 });

class MessageObject {
    /**
     * 
     * @param {string} type
     * @param {any} data
     */
    constructor(type, data = null) {
        this.type = type;
        this.data = data;
    }
}

let suiteSocket = null;
let receptionSocket = null;

webSocketServer.on('connection', (clientSocket, request) => {
    const userObject = Users.registerUser(clientSocket);
    console.log(`[${userObject.uniqueId}] connected to server.`);

    clientSocket.on('message', (message) => {
        const messageObject = translateMessage(message.toString());
        if (messageObject != null) {
            dispatchMessageObject(messageObject, userObject.uniqueId);
        }
    });

    clientSocket.on('close', () => {
        console.log(`[${userObject.uniqueId}] disconnected from server.`);
        Users.unregisterUser(userObject);
    });
});

/**
 * 
 * @param {WebSocket} clientSocket 
 * @param {string} type 
 * @param {any} data
 */
function sendMessage(clientSocket, type, data) {
    const messageObject = new MessageObject(type, data);
    const messageString = JSON.stringify(messageObject);
    if (clientSocket !== undefined) {
        clientSocket.send(messageString);
    }
}

function sendMessageToAllExcept(exception, type, data) {
    Users.getUsersSockets().forEach((socket) => {
        if (exception !== socket)
            sendMessage(socket, type, data);
    });
}

/**
 * 
 * @param {string} message 
 * @returns {object|null}
 */
function translateMessage(message) {
    try {
        const messageObject = JSON.parse(message);

        if (messageObject.type === undefined || messageObject.data === undefined) {
            return null;
        }

        return messageObject;
    } catch (error) {
        console.error(`Failed to parse message: ${error}\nMessage text: ${message}`);
        return null;
    }
}

/**
 * 
 * @param {MessageObject} messageObject 
 * @param {number} senderUniqueId
 */
function dispatchMessageObject(messageObject, senderUniqueId) {
    console.log(`[${senderUniqueId}] ${messageObject.type}: ${String(messageObject.data).slice(0, 20)}`);
    
    const senderSocket = Users.getSocketByUniqueId(senderUniqueId);
    const destinationSocket = senderSocket === suiteSocket ? receptionSocket : suiteSocket;

    switch (messageObject.type) {
        case 'registration':
            if (messageObject.data === 'suite') {
                suiteSocket = senderSocket;
            } else if (messageObject.data === 'reception') {
                receptionSocket = senderSocket;
            }
            break;
        default:
            sendMessageToAllExcept(senderSocket, messageObject.type, messageObject.data);
            break;
    }
}