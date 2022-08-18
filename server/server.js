const io = require("socket.io")(3002, {
    cors: {
        origin: ["http://localhost:8081"]
    },
})

const users = [];

io.on('connection', socket => {
    users.push(socket.id);
    io.in(socket.id).emit("All-Users", users.filter(user => user!==socket.id))
    socket.broadcast.emit('new-user', socket.id)
    socket.on('send-message', (message, room) => {
        console.log("message: ",message);
        console.log("room: ",room);
        socket.to(room).emit("receive-message", message)
    })

    socket.on('delete-id', (id) => {
        socket.broadcast.emit('delete-id', id)
        const id_index = users.indexOf(id);
        users.splice(id_index, 1);

    })
})