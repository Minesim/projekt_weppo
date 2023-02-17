const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {userJoin, getCurrentUser} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//setting "public" as static folder
app.use(express.static(path.join(__dirname,"public")));


io.on("connection", socket => {

    socket.on("joinRoom", ({username,room,role}) => {
        console.log("New connection");

        const user = userJoin(socket.id,username,room,role); //create new user
        socket.join(user.room); //join room
        socket.emit("message", `Welcome ${username}`); //to the user
        socket.broadcast.to(user.room).emit("message", `${username} has joined the room as a ${role}`) //to all room members
        //append_player_list(username);
    })

    
    

    socket.on("disconnect", () => {
        console.log("Disconnection");
    })


})

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

