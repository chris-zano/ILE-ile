const Classes = require('../../models/student/classes.model');
const Lecturer = require('../../models/lecturer/lecturer.model');
const Student = require('../../models/student/student.model');


exports.runCreateClasses = (req, res) => {
    const {adminData} = req;

    res.redirect(`/admins/render/classrooms/${adminData.id}`);
}