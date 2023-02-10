const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//setting "public" as static folder
app.use(express.static(path.join(__dirname,"public")));

io.on("connection", socket => {
    console.log("New WS Connection");

    socket.emit("message", "Welcome");
})


const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

