import express from 'express';
const router = express.Router();

//application imports
import {verifyLecturer} from '../admin/router.utils.js';
import * as lecturerRender from '../../controllers/lecturer/lecturer.render.controller.js';



//get lecturer interfaces
router.get('/lecturers/render/:pageUrl/:id', verifyLecturer, lecturerRender.renderLecturerViews);

// router.get('/lecturers/render/dashboards/:id', verifyLecturer, lecturerRender.renderDashboard);
// router.get('/lecturers/render/schedules/:id', verifyLecturer, lecturerRender.renderSchedules);
// router.get('/lecturers/render/submissions/:id', verifyLecturer, lecturerRender.renderSubmissions);
// router.get('/lecturers/render/announcements/:id', verifyLecturer, lecturerRender.renderAnnouncements);
// router.get('/lecturers/render/notifications/:id', verifyLecturer, lecturerRender.renderNotifications);
// router.get('/lecturers/render/courses/:id', verifyLecturer, lecturerRender.renderCourses);
// router.get('/lecturers/render/profile/:id', verifyLecturer, lecturerRender.renderViewLecturerProfile);
router.get('/lecturers/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);

export default router;