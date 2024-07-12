const socket = io();

function getOrCreateRoom(classId, hostId) {
    socket.emit("getOrCreateRoom", ({ classId, hostId }));
}

function updateCallerCandidates(roomref) {
    socket.emit("updateCallerCandidates", (roomref))
}

function emitCreateNewRoom(roomWithOffer, roomref) {
    socket.emit("createRoom", ({ roomWithOffer, roomref }));
}

function listenForRemoteSessionDescription(roomRef, property) {
    socket.emit('listenForSDP', ({ roomRef, property }));
}

function getMeetingRoom(roomId, hostId) {
    socket.emit("getMeetingRoom", ({ roomId, hostId }));
}