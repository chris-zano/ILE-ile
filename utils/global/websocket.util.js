import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server);
    const rooms = {};

    io.on('connection', socket => {
        console.log('Socket.IO client connected');

        //search
        socket.on('search', ({ category, searchInput }) => handleSearch(category, searchInput));

        socket.on('join meeting', (courseId) => {
            socket.join(courseId);
            socket.broadcast.to(courseId).emit("waiting for host", (courseId));
            
            socket.on('starting meeting', (courseId) => {
                socket.broadcast.to(courseId).emit("meeting-started", (courseId));
            })
        });
        //request for joining room
        socket.on('join-room', (roomId, userId, userName, uid) => {
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('user-connected', { userId, name: userName, cuid: uid });
            socket.on('send-message', (inputMsg, userName) => {
                io.to(roomId).emit('recieve-message', inputMsg, userName);
            })
            socket.on('disconnect', () => {
                console.log("user is disconnected", { userId, userName, uid })
                socket.broadcast.to(roomId).emit('user-disconnected', userId, userName);
            })
        });
    });

    return io;
}

export default setupWebSocketServer;