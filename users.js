const users = [];

//user joins the chat
function userJoin(id, username, room, role) {
  const user = { id, username, room, role }; //create a new user
  users.push(user);

  return user;
}


function getCurrentUser(id) {
  return users.find(user => user.id === id);
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


function getNumberOfPlayers(room) {
    return users.filter(user => (user.room === room && user.role === "player")).length;
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getNumberOfPlayers
  };