const { StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');
const { logError, logSession, getSystemDate } = require('../admin/admin.utils');

module.exports.renderDashboard = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Dashboard",
        stylesheets: [],
        pageUrl: 'layouts/dashboard',
        currentPage: 'dashboard',
        userType: 'Lecturer',
        scripts: []
    });
}

module.exports.renderSchedules = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Schedules",
        stylesheets: [],
        pageUrl: 'layouts/schedules',
        currentPage: 'schedules',
        userType: 'Lecturer',
        scripts: []
    });
}

module.exports.renderCourses = (req, res) => {
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
                currentPage: 'courses',
                userType: 'Lecturer',
                scripts: [],
                courses: courses
            });
        }).catch((error) => {
            logError(error);
        })


}

module.exports.renderClassrooms = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Classrooms",
        stylesheets: [],
        pageUrl: 'layouts/classrooms',
        currentPage: 'classrooms',
        userType: 'Lecturer',
        scripts: []
    });
}

module.exports.renderClassroom = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Classroom",
        stylesheets: [],
        pageUrl: 'layouts/classrooms.view.ejs',
        currentPage: 'classrooms',
        userType: 'Lecturer',
        scripts: []
    });
}

module.exports.renderCourse = (req, res) => {
    const { lecturerData } = req;
    const { courseId, id } = req.params;

    CoursesDB().findOne({ _id: courseId })
        .then((course) => {
            res.render('lecturer/lecturer-main', {
                lecturer: lecturerData,
                pageTitle: "Course",
                stylesheets: ['/css/lecturer/course.view'],
                pageUrl: 'layouts/course.view.ejs',
                currentPage: 'course',
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

module.exports.renderLive = (req, res) => {
    const { lecturerData } = req;

    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: "Live",
        stylesheets: [],
        pageUrl: 'layouts/live',
        currentPage: 'live',
        userType: 'Lecturer',
        scripts: []
    });
}

module.exports.renderViewLecturerProfile = (req, res) => {
    const { lecturerData } = req;

    // res.set('Cache-Control', 'public, max-age=30');
    res.render('lecturer/lecturer-main', {
        lecturer: lecturerData,
        pageTitle: `Profile ~ ${lecturerData.firstname}`,
        stylesheets: ["/css/lecturer/view.profile"],
        pageUrl: 'layouts/view.lecturer-profile.ejs',
        currentPage: '',
        userType: "lecturer",
        scripts: ["/script/scripts/lecturer/view.profile"]
    });

    return;
}