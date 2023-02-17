const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const {userJoin, getCurrentUser, userLeave, getRoomUsers, getRoomPlayers, getNumberOfPlayers} = require("./users");
const {checkIfLegalMove, makeMove, checkIfEnd} = require("./gameLogic")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setting "public" as static folder
app.use(express.static(path.join(__dirname,"public")));



io.on("connection", socket => {

    //user joins a room
    socket.on("joinRoom", ({username, room, role}) => {
        //console.log("New connection");//log on the server

        //check if there are 2 or more players in the room already and assign "X" or "O" as a symbol
        let symbol="";
        if(role === "player") {
            if (getNumberOfPlayers(room) >= 2) {
                socket.emit("message", "Failed to join as a player, you are a spectator"); //to the user
                role = "spectator";
                symbol = "";
            }
            else { //assign "X" or "O" to the players
                if (getNumberOfPlayers(room) == 0) symbol = "X";
                else if (getNumberOfPlayers(room) == 1) { 
                    //to make sure the players don't get the same symbol
                    if (getRoomPlayers(room)[0].symbol === "X") symbol = "O";
                    else symbol = "X";
                }
                //new player entered the room, no sense in keeping the old game
                io.to(room).emit("startNewGame", turn = "X");
            }
            socket.emit("symbol", symbol);
        }

        const user = userJoin(socket.id, username, room, role, symbol); //create new user

        socket.join(user.room); //join room
        socket.emit("message", `Welcome <mark>${username}</mark>`); //to the user
        socket.broadcast.to(user.room).emit("message", `<mark>${username}</mark> has joined the room as a ${role}`) //to all room members
        
        //sending new room member information to all room members
        io.to(user.room).emit("roomMembers", users = getRoomUsers(user.room))
        
        //sending room name to incoming user
        socket.emit("roomName", user.room);
        //sending the incoming user their username and role so that it can be displayed
        socket.emit("username/role", {username,role});

        //sending the current board state to incoming user
        /*
        the server doesn't store the board, so it has to be received from some other room member
        it is neccessary, otherwise the new user won't see correct information till next move,
        and if the new user is a player, their move could overwrite the current board
        */
        if (getRoomUsers(user.room).length > 1) {
        let otherRoomUser = getRoomUsers(user.room)[0].id
        io.to(otherRoomUser).emit("giveCurrentBoard"); //dealt with below
        }
    })
    
    //received current board, can send it to all, including incoming, users
    socket.on("currentBoardReceived", ({board, room}) => {
        io.to(room).emit("newBoard", board);
    })
    

    //user tries to make a move
    socket.on("move", ({role, symbol, fieldId, userId, board, room}) => {
        let info;
        if (role==="player") {
            //check if the move was legal
            if (!checkIfLegalMove(fieldId, board)) {
                info = "illegalMove";
            }
            else {
                board = makeMove(fieldId, symbol, board);
                io.to(room).emit("newBoard", board); //send new board state to the room users
                
                //check if the game ended (win/draw)
                let result = checkIfEnd(board, symbol);
                if (result === 2) info = "draw";
                else if (result === 1) info = `win by: ${userId}`;
                else info = "continue";
            }
            //emit new information about the game to all room members
            io.to(room).emit("nextMove", info);
        }
    })

    //user disconnects from a room
    socket.on("disconnect", () => {
        //console.log("Disconnection"); //log on the server
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit("message", `${user.role} <mark>${user.username}</mark> has left the room`) //to all room members
            //send updated user list
            io.to(user.room).emit("roomMembers", users = getRoomUsers(user.room))
        }
    })

})

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

