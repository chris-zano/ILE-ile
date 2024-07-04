import socketIo from 'socket.io'
import { findCourse, findStudent, findTutor, findMaterial } from '../../controllers/admin/admin.search';

function setupWebSocketServer(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        socket.on('search', ({ category, searchInput }) => {

            if (category == "courses") {
                findCourse(socket, searchInput)
            }

            switch (category) {
                case "courses":
                    findCourse(socket, searchInput);
                    break;
                case "students":
                    findStudent(socket, searchInput);
                    break;
                case "lecturers":
                    findTutor(socket, searchInput);
                    break;
                case "materials":
                    findMaterial(socket, searchInput);
                    break;
                default:
                    break;
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

export default setupWebSocketServer;
