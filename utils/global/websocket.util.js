import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';
import { storeData } from './socket/socket.firestore.js';

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        socket.on('search', ({ category, searchInput }) => handleSearch(category, searchInput));
        socket.on('firebase-store', (dataToStore) => storeData(socket, dataToStore));

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

export default setupWebSocketServer;
