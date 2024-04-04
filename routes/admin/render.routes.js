const express = require('express');
const router = express.Router();

//application imports
const adminRender = require('../../controllers/admin/admin.render');

//get ['/', '/login']
router.get('/', (req, res) => {
    console.log("New session: ", req.ip);
    res.render('index');
});


router.get('/login', (req, res) => {
    console.log("New SignIn attempt: ", req.ip);
    res.render('login');
})


//get admin interfaces
router.get('/admins/render/imports/:userType/:id', adminRender.renderImports);
router.get('/admins/render/dashboards/:id', adminRender.renderDashboard);
router.get('/admins/render/students/:id', adminRender.renderStudents);
router.get('/admins/render/tutors/:id', adminRender.renderTutors);
router.get('/admins/render/courses/:id', adminRender.renderCourses);
router.get('/admins/render/profile/student/:studentId/id', adminRender.renderViewStudent);
router.get('/admins/render/profile/tutor/:tutorId/id', adminRender.renderViewTutor);
router.get('/admins/render/profile/course/:courseCode/id', adminRender.renderViewCourse);
router.get('/admins/render/updates/student/:studentId/:id', adminRender.renderUpdateStudent);
router.get('/admins/render/updates/tutor/:tutorId/:id', adminRender.renderUpdateTutor);
router.get('/admins/render/updates/course/:courseId/:id', adminRender.renderUpdateCourse);
