function addNewRoom() {
    if (document.getElementById("newRoomName").value == "") return;
    let list = document.getElementById("room");
    let newRoom = document.createElement("option");
    newRoom.text = document.getElementById("newRoomName").value;
    document.getElementById("newRoomName").value = "";
    list.add(newRoom); //add new room to the list
}