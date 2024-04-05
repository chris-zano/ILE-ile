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
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Imports",
        stylesheets: [],
        pageUrl: 'layouts/imports',
        userType: userType,
        scripts: ["/script/scripts/admin/import"]
    });

    return;
}

exports.renderDashboard = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Dashboard",
        stylesheets: ["/css/admin/dashboard"],
        pageUrl: 'layouts/dashboard',
        userType: userType,
        scripts: ["/script/scripts/admin/dashboard"]
    });

    return;
}

exports.renderStudents = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Students",
        stylesheets: ["/css/admin/students"],
        pageUrl: 'layouts/students',
        userType: userType,
        scripts: ["/script/scripts/admin/students"]
    });

    return;

}

exports.renderTutors = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutors",
        stylesheets: ["/css/admin/tutors"],
        pageUrl: 'layouts/tutors',
        userType: userType,
        scripts: ["/script/scripts/admin/tutors"]
    });

    return;
}

exports.renderCourses = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Courses",
        stylesheets: ["/css/admin/courses"],
        pageUrl: 'layouts/courses',
        userType: userType,
        scripts: ["/script/scripts/admin/courses"]
    });

    return;
}

exports.renderUpdateStudent = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Student",
        stylesheets: ["/css/admin/update.student"],
        pageUrl: 'layouts/update.student',
        userType: userType,
        scripts: ["/script/scripts/admin/update.student"]
    });

    return;
}

exports.renderUpdateTutor = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Tutor",
        stylesheets: ["/css/admin/update.tutor"],
        pageUrl: 'layouts/update.tutor',
        userType: userType,
        scripts: ["/script/scripts/admin/update.tutor"]
    });

    return;
}

exports.renderUpdateCourse = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Course",
        stylesheets: ["/css/admin/update.course"],
        pageUrl: 'layouts/update.course',
        userType: userType,
        scripts: ["/script/scripts/admin/update.course"]
    });

    return;
}

exports.renderViewStudent = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Student-Profile",
        stylesheets: ["/css/admin/view.student"],
        pageUrl: 'layouts/view.student',
        userType: userType,
        scripts: ["/script/scripts/admin/view.student"]
    });

    return;
}

exports.renderViewTutor = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutor-Profile",
        stylesheets: ["/css/admin/view.tutor"],
        pageUrl: 'layouts/view.tutor',
        userType: userType,
        scripts: ["/script/scripts/admin/view.tutor"]
    });

    return;
}

exports.renderViewCourse = (req, res) => {
    const { userType, id } = req.params;
    const {adminData} = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Course-Profile",
        stylesheets: ["/css/admin/view.courses"],
        pageUrl: 'layouts/view.courses',
        userType: userType,
        scripts: ["/script/scripts/admin/view.courses"]
    });

    return;
}

