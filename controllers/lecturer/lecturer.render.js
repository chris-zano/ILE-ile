const { StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');
const { logError, logSession, getSystemDate } = require('../admin/admin.utils');

exports.renderDashboard = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Dashboard",
        stylesheets: [],
        pageUrl: 'layouts/dashboard',
        userType: 'Lecturer',
        scripts: []
    });
}

exports.renderSchedules = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Schedules",
        stylesheets: [],
        pageUrl: 'layouts/schedules',
        userType: 'Lecturer',
        scripts: []
    });
}

exports.renderCourses = (req, res) => {
    const { lecturerData } = req;

    CoursesDB().find({
        $and: [{ 'lecturer.lecturerId': lecturerData.lecturerId },
        { 'lecturer.name': `${lecturerData.firstname} ${lecturerData.lastname}` }]
    })
        .then((courses) => {
            res.render('lecturer/lecturer-main', {
                lecturer: lecturerData,
                pageTitle: "Courses",
                stylesheets: ['/css/lecturer/courses'],
                pageUrl: 'layouts/courses',
                userType: 'Lecturer',
                scripts: [],
                courses: courses
            });
        }).catch((error) => {
            logError(error);
        })


}

exports.renderAssignments = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Assignments",
        stylesheets: [],
        pageUrl: 'layouts/assignments',
        userType: 'Lecturer',
        scripts: []
    });
}

exports.renderAssignment = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Assignment",
        stylesheets: [],
        pageUrl: 'layouts/assignment',
        userType: 'Lecturer',
        scripts: []
    });
}

exports.renderCourse = (req, res) => {
    const { lecturerData } = req;
    const { courseId, id } = req.params;

    CoursesDB().findOne({ _id: courseId })
        .then((course) => {
            res.render('lecturer/lecturer-main', {
                lecturer: lecturerData,
                pageTitle: "Course",
                stylesheets: ['/css/lecturer/course.view'],
                pageUrl: 'layouts/course.view.ejs',
                userType: 'Lecturer',
                course: course,
                scripts: ['/script/scripts/lecturer/course.view']
            });
        }).catch((error) => {
            logError(error);
            res.render('global/error', { error: "Coul not find course with id " + courseId, status: 404 })
        })

    return;
}

exports.renderLive = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Live",
        stylesheets: [],
        pageUrl: 'layouts/live',
        userType: 'Lecturer',
        scripts: []
    });
}