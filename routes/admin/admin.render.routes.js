import express from 'express';
import { verifyAdmin, verifyUser } from './router.utils.js';
import * as adminRender from '../../controllers/admin/admin.render.js';

const router = express.Router();
//get ['/', '/login']
router.get('/', (req, res) => {
    console.log("New session: ", req.ip);
    res.render('index', { flush: "false" });
});

//get ['/admin/developer/new', '/admin/developer/index]
router.get('/admin/developer/new', (req, res) => {
    res.render('admin/developer/index');
})

router.get('/login', (req, res) => {
    console.log("New SignIn attempt: ", req.ip);
    res.render('login');
});

router.get('/global/error', (req, res) => {
    res.render('global/error', { error: "An Error occured", status: 404 });
})

router.get('/global/submit-ticket/:user/:id', verifyUser, (req, res) => {
    const { user } = req.params;
    const userdata = req.userObjectdata || null

    res.render('global/submit-ticket', { userdata: userdata})
})


//get admin interfaces
router.get('/admins/render/dashboards/:id', verifyAdmin, adminRender.renderDashboard);
router.get('/admins/render/imports/:userType/:id', verifyAdmin, adminRender.renderImports);
router.get('/admins/render/students/:id', verifyAdmin, adminRender.renderStudents);
router.get('/admins/render/tutors/:id', verifyAdmin, adminRender.renderTutors);
router.get('/admins/render/courses/:id', verifyAdmin, adminRender.renderCourses);
router.get('/admins/render/classrooms/:id', verifyAdmin, adminRender.renderClassrooms);
router.get('/admins/render/announcements/:id', verifyAdmin, adminRender.renderAnnouncements);
router.get('/admins/render/elibrary/:id', verifyAdmin, adminRender.renderElibrary);
router.get('/admins/render/profile/student/:studentId/:id', verifyAdmin, adminRender.renderViewStudent);
router.get('/admins/render/profile/tutor/:tutorId/:id', verifyAdmin, adminRender.renderViewTutor);
router.get('/admins/render/profile/course/:courseCode/id', verifyAdmin, adminRender.renderViewCourse);
router.get('/admins/render/updates/course/:courseCode/:id', verifyAdmin, adminRender.renderUpdateCourse);
router.get('/admins/render/organise-courses/:id', verifyAdmin, adminRender.renderOrganiseCourses);
router.get('/admins/render/profiles/admin/:id', verifyAdmin, adminRender.renderViewAdminProfile);

export default router;