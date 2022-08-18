window.onbeforeunload = function() {  
    socket.emit('delete-id', socket.id);
 
    return "Do you really want to leave our brilliant application?";   
    //if we return nothing here (just calling return;) then there will be no pop-up question at all   
    //return;
  };


import { io } from "socket.io-client"

var roomContainer = document.getElementById('room-container');
var joinRoomButton = document.getElementById('room-button');
var roomInput = document.getElementById('room-input');
var sendBtn = document.getElementById('send-button');
var messageInput = document.getElementById('message-input');
var form = document.getElementById('form');
var messageContainer = document.getElementById('message-container');
var usersContainer = document.querySelector('#users-container');

var room = "";
var users = [];
var usersNodes = [];
var roomID = "";

const socket = io("http://localhost:3002");
socket.on('connect', () => {
    console.log("id: ",socket.id);
    messageContainer.innerHTML  = "";
    displayReceivedMessage(`You connected with id: ${socket.id}`)
})

const createAllUsers = (users) => {
    users.forEach(id => {
        addNewUser(id)
    });
}
socket.on('All-Users', data => {
    users = data;
    console.log("users333: ",users);
    createAllUsers(users)

    /*********************************/
    const ChatUser = createChatUser({ "id": users[users.length-1]});
    roomContainer.innerHTML = "";
    roomContainer.appendChild(ChatUser);
    roomID = users[users.length-1];
    console.log("room: ",roomID);
    /*********************************/
})
/************************* addNew ****************/
socket.on('new-user', id => {
    users.push(id);
    addNewUser(id)

})

function addNewUser(id){
    const sideUserBtn = createSideUser({"id": id});
    usersContainer.appendChild(sideUserBtn);

    sideUserBtn.addEventListener('click', (e) => {
        const ChatUser = createChatUser({ "id": id});
        roomContainer.innerHTML = "";
        roomContainer.appendChild(ChatUser);
        roomID = id;
    })

    // usersNodes.push(roomContainer.innerHTML);
    // console.log(roomContainer.children[0].getAttribute('id'));
    // const previousId = roomContainer.children[0].getAttribute('id');
    // usersNodes.push({"id": previousId, "node": ChatUser});
    console.log("usersNodes ",usersNodes);
}

const createSideUser = (user) => {
    const button = document.createElement('button')
    button.setAttribute('id', user.id)
    button.classList.add('user')
    button.innerHTML = user.id;
    return button;
}
/*************************************/
socket.on("receive-message", message => {
    displayReceivedMessage(message);
})
/*********** **********/
const deleteSideUser = (user) => {
    var toDeleteUser = document.getElementById(user.id);
    if(toDeleteUser === null)
        return null;
    toDeleteUser.parentNode.removeChild(toDeleteUser);
}
socket.on("delete-id", id => {
    const id_index = users.indexOf(id);
    users.splice(id_index, 1);
    deleteSideUser({"id": id})
})
/**********************/

form.addEventListener('click', formClickHandler(e))

joinRoomButton.addEventListener('click', (e) => {
    e.preventDefault();
    const roomInput = roomInput.value;
})

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();
})

function displaySentMessage(message){
    const div = document.createElement('div')
    div.textContent = message
    div.classList.add('sent-message')
    messageContainer.append(div)
}

function displayReceivedMessage(message){
    const div = document.createElement('div')
    div.textContent = message
    div.classList.add('received-message')
    messageContainer.append(div)
}

function displayCenterMessage(message) {
    const div = document.createElement('div')
    div.textContent = message
    div.classList.add('center-message')
    return div;
}

function createChatUser(user)  {
            roomID = user.id;

            messageContainer = document.createElement('div')
            messageContainer.setAttribute("id", "message-container")

            const form = document.createElement('form')
            form.setAttribute("id", "form")

            const label_message = document.createElement('label')
            label_message.innerHTML = "Message"
            label_message.setAttribute("for", "message-input")

            messageInput = document.createElement('input')
            messageInput.setAttribute("id", "message-input")
            messageInput.setAttribute("type", "text")

            const buttonSend = document.createElement('button')
            buttonSend.innerHTML = "Send"
            buttonSend.setAttribute("id", "send-button")
            buttonSend.setAttribute("type", "submit")

            const label_room = document.createElement('label')
            label_room.innerHTML = "Room"
            label_room.setAttribute("for", "room-input")
            label_room.style.marginLeft= '50px';

            roomInput = document.createElement('input')
            roomInput.setAttribute("id", "room-input")
            roomInput.setAttribute("type", "text")

            const buttonJoin = document.createElement('button')
            buttonJoin.innerHTML = "Join"
            buttonJoin.setAttribute("id", "room-button")
            buttonJoin.setAttribute("type", "submit")

            form.appendChild(label_message)
            form.appendChild(messageInput)
            form.appendChild(buttonSend)
            form.appendChild(label_room)
            form.appendChild(roomInput)
            form.appendChild(buttonJoin)

            form.addEventListener('click', (e) => formClickHandler(e))

            const container = document.createElement('div')
            container.setAttribute('id', user.id)

            container.appendChild(messageContainer)
            messageContainer.appendChild(displayCenterMessage("***userId***: " + user.id))
            container.appendChild(form)

            return container;

        //     ` 
        // <div id="message-container">
        // </div>
        // <form id="form">
        //     <label for="message-input">Message</label>
        //     <input type="text" id="message-input" />
        //     <button type="submit" id="send-button">Send</button>
            
        //     <label for="room-input">Room</label>
        //     <input type="text" id="room-input" />
        //     <button type="submit" id="room-button">Join</button>
        // </form>`
}


function formClickHandler (e)  {
    e.preventDefault();
    const message = messageInput.value;
    // roomID = roomInput.value;
    
    if(message ==="") return

    socket.emit('send-message', message, roomID);
    displaySentMessage(message);
    messageInput.value = "";
    console.log("usersNodes: ", usersNodes);
}