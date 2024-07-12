import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        //search
        socket.on('search', ({ category, searchInput }) => handleSearch(category, searchInput));

        //rtc -signaling server
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId)
            socket.to(roomId).emit('user-connected', userId)

            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId)
            })
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

export default setupWebSocketServer;