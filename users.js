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


module.exports = {
    userJoin,
    getCurrentUser
  };