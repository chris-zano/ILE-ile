const socket = io();

socket.emit("firebase-store", ("genericDataFromClient"));
socket.on('firebase-store-complete' , (docref) =>{
    console.log(docref)
    console.log(docref.docref.doc())
})