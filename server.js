const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require("./users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//setting "public" as static folder
app.use(express.static(path.join(__dirname,"public")));


io.on("connection", socket => {

    socket.on("joinRoom", ({username,room,role}) => {
        console.log("New connection");//log on the server

        const user = userJoin(socket.id,username,room,role); //create new user
        socket.join(user.room); //join room
        socket.emit("message", `Welcome ${username}`); //to the user
        socket.broadcast.to(user.room).emit("message", `${username} has joined the room as a ${role}`) //to all room members
        

        //sending room member information to all room members
        io.to(user.room).emit("roomMembers", users = getRoomUsers(user.room))
        socket.emit("roomName",user.room);
    })
    

    socket.on("disconnect", () => {
        console.log("Disconnection");
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit("message", `${user.role} ${user.username} has left the room`) //to all room members
            //send updated user list
            io.to(user.room).emit("roomMembers", {
                users: getRoomUsers(user.room),
            })
        }
    })

})

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

