const socket = io();


//to get username and room from url, i.e. from the form
const { username, room, role } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
//send username and url to the server
socket.emit("joinRoom", {username, room, role})

socket.on("roomName", (room) => {
    displayRoomName(room);
})


//get symbol assigned by the server
let symbol = "";
socket.on("symbol", (s) => {
    //TODO: display your symbol on the side
    symbol = s;
})

//get and display room members
socket.on("roomMembers", (users) => {
    dispayRoomMembers(users);
})

//print recieved message to the console
socket.on("message", message => {
    //TODO: make it display on the side as logs, perhaps even as a chat
    console.log(message);
})

//server requests curent board state for incoming user
socket.on("giveCurrentBoard", () => {
    let board = getBoard();
    socket.emit("currentBoardReceived", { board, room });
})

function getBoard() {
    return {
        "NW" : document.getElementById("NW").innerHTML,
        "N" : document.getElementById("N").innerHTML,
        "NE" : document.getElementById("NE").innerHTML,
        "W" : document.getElementById("W").innerHTML,
        "C" : document.getElementById("C").innerHTML,
        "E" : document.getElementById("E").innerHTML,
        "SW" : document.getElementById("SW").innerHTML,
        "S" : document.getElementById("S").innerHTML,
        "SE" : document.getElementById("SE").innerHTML,
    }
}
//make move on the tic-tac-toe field
function move(fieldId) {
    let board = getBoard();
    let userId = socket.id
    socket.emit("move", {role, symbol, fieldId, userId, board, room }); //send information what move was made and by which user
}


socket.on("newBoard", board => {
    displayBoard(board);
})


socket.on("nextMove", info => {
    //if (info === "draw")
    //else if (info == win)
    //TODO: deal with new information
})


function displayRoomName(room) {
    let title = document.getElementById("title");
    title.innerHTML += "<h1>Room: " + room + "</h1><br>";
}


function dispayRoomMembers(users) {
    //dislay player list
    let ulPlayers = document.getElementById("playerList");
    ulPlayers.innerHTML = "";
    for (user in users) {
        if (users[user].role==="player") {
            ulPlayers.innerHTML += "<li>" + users[user].username + "</li>";
        }
    }

    //display spectator list
    let ulSpectators = document.getElementById("spectatorList");
    ulSpectators.innerHTML = "";
    for (user in users) {
        if (users[user].role === "spectator") {
            ulSpectators.innerHTML += "<li>" + users[user].username + "</li>";
        }
    }
}

//displays board with new information after move
function displayBoard(board) {
    document.getElementById("NW").innerHTML = board["NW"];
    document.getElementById("N").innerHTML = board["N"];
    document.getElementById("NE").innerHTML = board["NE"];
    document.getElementById("W").innerHTML = board["W"];
    document.getElementById("C").innerHTML = board["C"];
    document.getElementById("E").innerHTML = board["E"];
    document.getElementById("SW").innerHTML = board["SW"];
    document.getElementById("S").innerHTML = board["S"];
    document.getElementById("SE").innerHTML = board["SE"];
}