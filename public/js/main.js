const socket = io();


//to get username and room from url, i.e. from form
const { username, room, role } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
//send username and url to the server
socket.emit("joinRoom", {username,room,role})


socket.on("message", message => {
    console.log(message);
})


//make move on the tic-tac-toe field
function change(id)
{
    document.getElementById(id).innerHTML = "X";
}

