const socket = io();

socket.on("message", message => {
    console.log(message);
})

/////
function change(id)
{
    document.getElementById(id).innerHTML = "X";
}