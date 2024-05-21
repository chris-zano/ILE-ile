const Materials = require('../../models/courses/courses.model');
const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');

module.exports.findCourse = (socket, value) => {
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
       socket.emit("searchResults", {type: "courses", results: docs});
    }).catch((error) => {
        console.log(error);
    })
};

module.exports.findStudent = (socket, value) => {
    const regex = new RegExp(value, "i");

    if (value == "") {
        return;
    }

    const query = {
        $or: [
            {studentId: {$regex: regex}},
            {firstName: {$regex: regex}},
            {lastName: {$regex: regex}}
        ]
    }

    StudentsDB().find(query)
    .then((docs) => {
        socket.emit("searchResults", {type: "students", results: docs})
    }).catch((error) => {
        console.log(error);
    })
}

module.exports.findTutor = (socket, value) => {
    const regex = new RegExp(value, "i");
    if (value == "") {
        return;
    }

    const query = {
        $or: [
            {lecturerId: {$regex: regex}},
            {firstName: {$regex: regex}},
            {lastName: {$regex: regex}}
        ]
    }

    LecturersDB().find(query)
    .then((docs) => {
        socket.emit("searchResults", {type: "tutors", results: docs})
    }).catch((error) => {
        console.log(error);
    })
}

module.exports.findMaterial = (socket, value) => {
    const regex = new RegExp(value, "i");

    if (value == "") {
        return;
    }

    const query = {
        $or: [
            {originalname: {$regex: regex}},
            {courseId: {$regex: regex}},
            {createdAt: {
                date: {$regex: regex},
                month: {$regex: regex},
                year: {$regex: regex}
            }}
        ]
    }

    Materials.find(query)
    .then((docs) => {
        socket.emit("searchResults", {type: "materials", results: docs})
    }).catch((error) => {
        console.log(error);
    })
}