const socket = io();

socket.on("message", message => {
    console.log(message);
})


//make move on the tic-tac-toe field
function change(id)
{
    document.getElementById(id).innerHTML = "X";
}

