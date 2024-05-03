const express = require('express');
const router = express.Router();

//application imports
const {verifyAdmin, verifyLecturer} = require('./router.utils');
const adminRender = require('../../controllers/admin/admin.render');

//get ['/', '/login']
router.get('/', (req, res) => {
    console.log("New session: ", req.ip);
    res.render('index');
});


router.get('/login', (req, res) => {
    console.log("New SignIn attempt: ", req.ip);
    res.render('login');
});

// router.get('/global/error', (req, res) => {
//     res.render('global/error', {error: "An Error occured", status: 404});
// })


//get admin interfaces
router.get('/admins/render/dashboards/:id', verifyAdmin, adminRender.renderDashboard);
router.get('/admins/render/imports/:userType/:id', verifyAdmin, adminRender.renderImports);
router.get('/admins/render/students/:id', verifyAdmin, adminRender.renderStudents);
router.get('/admins/render/tutors/:id', verifyAdmin, adminRender.renderTutors);
router.get('/admins/render/courses/:id', verifyAdmin, adminRender.renderCourses);
router.get('/admins/render/classrooms/:id', verifyAdmin, adminRender.renderClassrooms);
router.get('/admins/render/profile/student/:studentId/id', verifyAdmin, adminRender.renderViewStudent);
router.get('/admins/render/profile/tutor/:tutorId/id', verifyAdmin, adminRender.renderViewTutor);
router.get('/admins/render/profile/course/:courseCode/id', verifyAdmin, adminRender.renderViewCourse);
router.get('/admins/render/updates/student/:studentId/:id', verifyAdmin, adminRender.renderUpdateStudent);
router.get('/admins/render/updates/tutor/:tutorId/:id', verifyAdmin, adminRender.renderUpdateTutor);
router.get('/admins/render/updates/course/:courseCode/:id', verifyAdmin, adminRender.renderUpdateCourse);


//get lecturer interfaces
router.get('/lecturers/render/dashboards/:id', verifyLecturer, )

module.exports = router;