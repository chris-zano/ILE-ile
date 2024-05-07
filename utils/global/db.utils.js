const Admins = require('../../models/admin/admin.models');
const Lecturers = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');
const Classes = require('../../models/student/classes.model');
const Courses = require('../../models/courses/courses.model');

function AdminsDB() { return Admins }
function LecturersDB() { return Lecturers }
function StudentsDB() { return Students }
function ClassesDB() { return Classes }
function CoursesDB() { return Courses }

module.exports = {AdminsDB,LecturersDB,StudentsDB,ClassesDB,CoursesDB};