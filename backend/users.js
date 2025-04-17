const WebSocket = require('ws');

const users = [];
const usersSockets = new Map();
let lastUsedId = 0;

class User
{
    /**
     * @param {number} uniqueId 
     * @param {string} [name='']
     */
    constructor(uniqueId, name = '')
    {
        this.uniqueId = uniqueId;
        this.name = name;
    }
}

/**
 * 
 * @param {WebSocket} socket 
 * @returns {User}
 */
function registerUser(socket)
{
    const userObject = new User(lastUsedId);
    users.push(userObject);
    usersSockets.set(userObject, socket);
    lastUsedId++;
    return userObject;
}

/**
 * 
 * @param {User} user 
 */
function unregisterUser(user)
{
    const index = users.indexOf(user);
    if (index != -1)
    {
        usersSockets.delete(user);
        users.splice(index, 1);
    }
}

/**
 * 
 * @param {number} uniqueId 
 * @returns {User}
 */
function getUserByUniqueId(uniqueId)
{
    return users.find(user => user.uniqueId === uniqueId) || null;
}

/**
 * 
 * @param {number} uniqueId 
 * @returns {WebSocket|null}
 */
function getSocketByUniqueId(uniqueId)
{
    const user = getUserByUniqueId(uniqueId);
    if (user == null)
    {
        return null;
    }
    return usersSockets.get(user) || null;
}

function getUsersSockets()
{
    return usersSockets;
}

module.exports = {registerUser, unregisterUser, getUserByUniqueId, getSocketByUniqueId, getUsersSockets};