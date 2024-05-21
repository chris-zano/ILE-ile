const Admins = require('../../models/admin/admin.models');
const Lecturers = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');
const Classes = require('../../models/student/classes.model');
const Courses = require('../../models/courses/courses.model');
const Commons = require('../../models/users/commons.model');

function AdminsDB() { return Admins }
function LecturersDB() { return Lecturers }
function StudentsDB() { return Students }
function ClassesDB() { return Classes }
function CoursesDB() { return Courses }
function UsersCommonsDB() { return Commons }

module.exports = {AdminsDB,LecturersDB,StudentsDB,ClassesDB,CoursesDB, UsersCommonsDB};