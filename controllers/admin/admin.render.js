/**
 * render stack
 * 
 * error-page (global)
 * imports-page (students) (tutors) (courses)
 * dashboard
 * students-page (list of students per faculty) (locked)
 * tutors-page (list of tutors per faculty) (locked)
 * courses-page (list of courses per faculty) (locked)
 * 
 * update-student-page
 * update-tutor-page
 * update-courses-page
 * 
 * view-student-page
 * view-tutor-page
 * view-course-page
 * 
 * 
 * format for render
 * 
 * res.render('login');
 * 
 * res.render('admin-main', {adminObject[id, firstname, faculty], pageTitle, stylesheets[], pageUrl});
 * 
 * requests on pages that load admin-main should follow this stack
 * /admin/render/[:interfaces]/:id
 */

/**
 * render the login page
 */

const Admins = require('../../models/admin/admin.models');
const Lecturers = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');
const Courses = require('../../models/courses/courses.model');
const utils = require('./admin.utils');

exports.renderImports = async (req, res) => {
    const { userType, id } = req.params;

    Admins.findById(id)
        .then((admin) => {
            if (admin == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { message: "Unauthorised access", status: 403 });
            }
            else {
                const adminData = {
                    id: admin._id,
                    firstname: admin.firstName,
                    lastname: admin.lastName,
                    faculty: admin.faculty
                }
                res.render('admin/admin-main', {
                    admin: adminData,
                    pageTitle: "Imports",
                    stylesheets: [],
                    pageUrl: 'layouts/imports',
                    userType: userType
                });
            }
        }).catch((error) => {
            utils.logError(error);
            return {
                message: "An error occured",
                admin: {},
                status: 500
            }
        });

    return;
}

exports.renderDashboard = (req, res) => {
    
}

exports.renderStudents = (req, res) => {

}

exports.renderTutors = (req, res) => {

}

exports.renderCourses = (req, res) => {

}

exports.renderUpdateStudent = (req, res) => {

}

exports.renderUpdateTutor = (req, res) => {

}

exports.renderUpdateCourse = (req, res) => {

}

exports.renderViewStudent = (req, res) => {

}

exports.renderViewTutor = (req, res) => {

}

exports.renderViewCourse = (req, res) => {

}

