const socketIo = require('socket.io');
const { findCourse, findStudent } = require('../../controllers/admin/admin.search');

function setupWebSocketServer(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('Socket.IO client connected');

        socket.on('search', ({ category, searchInput }) => {
            console.log('Received search request from client:');
            console.log('Category:', category);
            console.log('Search Input:', searchInput);

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

module.exports = setupWebSocketServer;
