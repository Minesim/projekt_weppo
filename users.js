const users = [];

//user joins the chat
function userJoin(id, username, room, role, symbol) {
  const user = { id, username, room, role, symbol }; //create a new user
  users.push(user);

  return user;
}


function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}


function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}


function getRoomPlayers(room) {
    return users.filter(user => (user.room === room && user.role === "player"));
}


function getNumberOfPlayers(room) {
    return getRoomPlayers(room).length;
}


module.exports = {
    userJoin,
    userLeave,
    getRoomUsers,
    getRoomPlayers,
    getNumberOfPlayers
  };