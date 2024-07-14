import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server);
    const rooms = {};

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        //search
        socket.on('search', ({ category, searchInput }) => handleSearch(category, searchInput));

        //rtc -signaling server
        // socket.on('join-room', (roomId, userId) => {
        //     socket.join(roomId)
        //     socket.to(roomId).emit('user-connected', userId)

        //     socket.on('disconnect', () => {
        //         socket.to(roomId).emit('user-disconnected', userId)
        //     })
        // });

        // socket.on('disconnect', () => {
        //     console.log('Client disconnected');
        // });

        socket.on('join-room', (roomId, userId) => {
            if (!rooms[roomId]) {
                rooms[roomId] = []
            }
            rooms[roomId].push(userId)
            socket.join(roomId)
            socket.to(roomId).emit('user-connected', userId)

            socket.on('disconnect', () => {
                rooms[roomId] = rooms[roomId].filter(id => id !== userId)
                socket.to(roomId).emit('user-disconnected', userId)
            })
        });

        socket.on('make-call', (userId) => {
            socket.emit("place-call", userId);
        })
    });

    return io;
}

export default setupWebSocketServer;