
// import Materials from '../../models/courses/courses.model.js';
import { AdminsDB, StudentsDB, CoursesDB, LecturersDB } from '../../utils/global/db.utils.js';
import { logError } from './admin.utils.js';

export const findCourse = (socket, value) => {
    try {
        const regex = new RegExp(value, 'i');

        if (value == "") {
            return;
        }

        const query = {
            $or: [
                { courseCode: { $regex: regex } },
                { title: { $regex: regex } },
                { resources: { $in: [value] } },
                { assignments: { $in: [value] } },
                { recordings: { $in: [value] } },
            ],
        };

        CoursesDB().find(query)
            .then((docs) => {
                socket.emit("searchResults", { type: "courses", results: docs });
            }).catch((error) => {
                logError(error)
            })
    } catch (error) {
        logError(error);
    }
};

export const findStudent = (socket, value) => {
    try {
        const regex = new RegExp(value, "i");

    if (value == "") {
        return;
    }

    const query = {
        $or: [
            { studentId: { $regex: regex } },
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } }
        ]
    }

    StudentsDB().find(query)
        .then((docs) => {
            socket.emit("searchResults", { type: "students", results: docs })
        }).catch((error) => {
            logError(error);
        })
    } catch (error) {
        logError(error)
    }
}

export const findTutor = (socket, value) => {
    try {
        const regex = new RegExp(value, "i");
    if (value == "") {
        return;
    }

    const query = {
        $or: [
            { lecturerId: { $regex: regex } },
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } }
        ]
    }

    LecturersDB().find(query)
        .then((docs) => {
            socket.emit("searchResults", { type: "tutors", results: docs })
        }).catch((error) => {
            logError(error);
        })
    }catch(error) {
        logError(error)
    }
}
