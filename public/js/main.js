const socket = io();


//to get username and room from url, i.e. from the form
const { username, room, role } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
//send username and url to the server
socket.emit("joinRoom", {username,room,role})

socket.on("roomName", (room) => {
    displayRoomName(room);
})

//get and display room members
socket.on("roomMembers", (users) => {
    dispayRoomMembers(users);
})

//print recieved message to the console
socket.on("message", message => {
    console.log(message);
})


//make move on the tic-tac-toe field
function change(id)
{
    document.getElementById(id).innerHTML = "X";
}


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