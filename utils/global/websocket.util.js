import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';
import { addDatabaseListener, createRoomWithOffer, getMeetingRoom, getOrCreateRoom, updateRTCDocument } from './socket/socket.firestore.js';

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        //search
        socket.on('search', ({ category, searchInput }) => handleSearch(category, searchInput));

        //rtc -signaling server
        socket.on('createRoom', ({ roomWithOffer, roomref }) => createRoomWithOffer(socket, roomWithOffer, roomref));
        socket.on("listenForSDP", ({roomref, property}) => addDatabaseListener(socket,roomref, property));
        socket.on('getOrCreateRoom', ({ classId, hostId }) => getOrCreateRoom(socket, classId, hostId));
        socket.on('updateCallerCandidates', (roomref) => updateRTCDocument(socket, roomref));
        socket.on('getMeetingRoom' , ({ roomId, hostId }) => getMeetingRoom(socket, roomId, hostId))

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

export default setupWebSocketServer;