import { Server as SocketIoServer } from 'socket.io'
import handleSearch from './socket/socket.search.js';
import { CoursesDB } from './db.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { createServer } from "http";

const Courses = CoursesDB();

const setupWebSocketServer = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        },
        path: '/socket.io'
    });

    io.on('connection', socket => {
        try {
            //search
            socket.on('search', ({ category, searchInput }) => handleSearch(socket, category, searchInput));


            //waiting room
            socket.on('join meeting', async (courseId) => {

                socket.join(courseId);

                const meetingStatus = await Courses.findOne({ _id: courseId }, { meeting_status: 1 });
                if (!meetingStatus || meetingStatus.meeting_status === 'in meeting') {
                    socket.broadcast.to(courseId).emit("meeting started", (courseId));
                }
                else {
                    socket.broadcast.to(courseId).emit("waiting for host", (courseId));
                }

            });

            socket.on('starting meeting', async (courseId) => {

                socket.broadcast.to(courseId).emit("meeting-started", (courseId));

                await Courses.findOneAndUpdate({ _id: courseId }, { $set: { meeting_status: "in meeting", call_start: new Date().getTime() }, $inc: { __v: 1 } }, { new: true });
            })

            //request for joining room
            socket.on('join-room', ({roomId, peerId, name, userId}) => {
                socket.join(roomId);

                socket.broadcast.to(roomId).emit('user-connected', { userId, name: userName, cuid: uid });

                socket.on('send-message', (inputMsg, userName) => {
                    io.to(roomId).emit('recieve-message', inputMsg, userName);
                });

                socket.on('end-call-for-all', (roomId) => {
                    socket.broadcast.to(roomId).emit('call-terminated');
                })

                socket.on('disconnect', () => {
                    socket.broadcast.to(roomId).emit('user-disconnected', userId, userName);
                })
            });
        } catch (error) {
            logError(error)
        }

    });

    return io;
}

export default setupWebSocketServer;