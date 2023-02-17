const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {userJoin, getCurrentUser, userLeave, getRoomUsers, getNumberOfPlayers} = require("./users");
const {checkIfLegalMove, makeMove, checkIfEnd} = require("./gameLogic")

const app = express();
const server = http.createServer(app);
const io = socketio(server);


//setting "public" as static folder
app.use(express.static(path.join(__dirname,"public")));


io.on("connection", socket => {

    //user joins a room
    socket.on("joinRoom", ({username,room,role}) => {
        console.log("New connection");//log on the server

        //TODO: deal with more than 2 players, assign X or O

        //check if there are 2 or more players in the room already
        if(role === "player" && getNumberOfPlayers(room) >= 2)
        {
            socket.emit("message", "Failed to join as a player, you are a spectator"); //to the user
            role = "spectator";
        }

        const user = userJoin(socket.id,username,room,role); //create new user

        socket.join(user.room); //join room
        socket.emit("message", `Welcome ${username}`); //to the user
        socket.broadcast.to(user.room).emit("message", `${username} has joined the room as a ${role}`) //to all room members
        

        //sending room member information to all room members
        io.to(user.room).emit("roomMembers", users = getRoomUsers(user.room))
        socket.emit("roomName", user.room);
    })
    

    //user tries to make a move
    socket.on("Move", ({role, fiedlId, userId, board}) => {
        if (role==="player") {
            //check if the move was legal
            if (!checkIfLegalMove(fiedlId, board)) {
                info = "illegalMove";
            }
            else {
                board = makeMove(fieldId, player, board);
                //check if the game ended (win/draw)
                let result = checkIfEnd(board);
                if (result === 2) info = "draw";
                else if (result === 1) info = `win by: ${userId}`;
                else info = "continue";
            }
            //emit new information about the game to all room members
            io.to(user.room).emit("nextMove", info);
            
            //document.getElementById(fiedlId).innerHTML = "X";
        }
    })

    //user disconnects from a room
    socket.on("disconnect", () => {
        console.log("Disconnection");
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit("message", `${user.role} ${user.username} has left the room`) //to all room members
            //send updated user list
            io.to(user.room).emit("roomMembers", users = getRoomUsers(user.room))
        }
    })

})

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

