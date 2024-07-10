const socket = io();

socket.emit("firebase-store", ("genericDataFromClient"));
socket.on('firebase-store-complete', (docref) => {
    console.log(docref)
})

function emitCreateNewRoom(roomWithOffer, classId) {
    console.log({roomWithOffer, classId})
    socket.emit("createRoom", ({roomWithOffer, classId}));
}