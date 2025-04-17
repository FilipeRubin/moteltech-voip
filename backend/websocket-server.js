const WebSocket = require('ws');
const Users = require('./users');
const webSocketServer = new WebSocket.Server({host: '0.0.0.0', port: 12501});

class MessageObject
{
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
    console.log(`Client ${request.socket.remoteAddress} connected to server.`);
    const userObject = Users.registerUser(clientSocket);

    clientSocket.on('message', (message) => {
        const messageObject = translateMessage(message.toString());
        if (messageObject != null)
        {
            dispatchMessageObject(messageObject, userObject.uniqueId);
        }
    });

    clientSocket.on('close', () => {
        console.log(`Client ${request.socket.remoteAddress} disconnected to server.`);
        Users.unregisterUser(userObject);
    });
});

/**
 * 
 * @param {WebSocket} clientSocket 
 * @param {string} type 
 * @param {any} data
 */
function sendMessage(clientSocket, type, data)
{
    const messageObject = new MessageObject(type, data);
    const messageString = JSON.stringify(messageObject);
    if (clientSocket != undefined)
    {
        clientSocket.send(messageString);
    }
}

/**
 * 
 * @param {string} message 
 * @returns {object|null}
 */
function translateMessage(message)
{
    try
    {
        const messageObject = JSON.parse(message);

        if (messageObject.type === undefined || messageObject.data === undefined)
        {
            return null;
        }

        return messageObject;
    }
    catch (error)
    {
        console.error(`Failed to parse message: ${error}\nMessage text: ${message}`);
        return null;
    }
}

/**
 * 
 * @param {MessageObject} messageObject 
 * @param {number} senderUniqueId
 */
function dispatchMessageObject(messageObject, senderUniqueId)
{
    console.log(`[${senderUniqueId}] ${messageObject.type}: ${String(messageObject.data).slice(0, 20)}`);
    
    const destinationSocket = Users.getSocketByUniqueId(senderUniqueId) == suiteSocket ? receptionSocket : suiteSocket;

    switch (messageObject.type)
    {
    case 'registration':
        if (messageObject.data === 'suite')
            suiteSocket = Users.getSocketByUniqueId(senderUniqueId);
        else if (messageObject.data === 'reception')
            receptionSocket = Users.getSocketByUniqueId(senderUniqueId);
        break;
    default:
        sendMessage(destinationSocket, messageObject.data, messageObject.data);
        break;
    }
}
