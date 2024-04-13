const Tutors = require('../../models/lecturer/lecturer.model');
const Admins = require('../../models/admin/admin.models');
const Students = require('../../models/student/student.model');
const Courses = require('../../models/courses/courses.model');
const Files = require('../../models/courses/files.models');
const Materials = require('../../models/courses/courses.model');

exports.findCourse = (socket, value) => {
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

    Courses.find(query)
    .then((docs) => {
       socket.emit("searchResults", {type: "courses", results: docs});
    }).catch((error) => {
        console.log(error);
    })
};

exports.findStudent = (socket, value) => {
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

    Students.find(query)
    .then((docs) => {
        socket.emit("searchResults", {type: "students", results: docs})
    }).catch((error) => {
        console.log(error);
    })
}

exports.findTutor = (socket, value) => {
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

    Tutors.find(query)
    .then((docs) => {
        socket.emit("searchResults", {type: "tutors", results: docs})
    }).catch((error) => {
        console.log(error);
    })
}

exports.findMaterial = (socket, value) => {
    const regex = new RegExp(value, "i");

    if (value == "") {
        return;
    }

    const query = {
        $or: [
            {originalname: {$regex: regex}},
            {courseId: {$regex: regex}},
            {'created-at': {
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