const Tutors = require('../../models/lecturer/lecturer.model');
const Admins = require('../../models/admin/admin.models');
const Students = require('../../models/student/student.model');
const Courses = require('../../models/courses/courses.model');
const Files = require('../../models/courses/files.models');
const Materials = require('../../models/courses/courses.model');

exports.findCourse = (socket, value) => {
    const regex = new RegExp(value, 'i');

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
       console.log(docs)
       socket.emit("searchResults", docs);
    }).catch((error) => {
        console.log(error);
    })
};

exports.findStudent = (socket, value) => {
    const regex = new RegExp(value, "i");

    const query = {
        $or: [
            {studentId: {$regex: regex}},
            {firstName: {$regex: regex}},
            {lastName: {$regex: regex}}
        ]
    }

    Students.find(query)
    .then((docs) => {
        console.log(docs);
        socket.emit("searchResults", docs)
    }).catch((error) => {
        console.log(error);
    })
}