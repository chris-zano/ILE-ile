import express from 'express';
const router = express.Router();

//application imports
import {verifyLecturer} from '../admin/router.utils.js';
import * as lecturerRender from '../../controllers/lecturer/lecturer.render.controller.js';



//get lecturer interfaces
router.get('/lecturers/render/dashboards/:id', verifyLecturer, lecturerRender.renderDashboard);
router.get('/lecturers/render/courses/:id', verifyLecturer, lecturerRender.renderCourses);
router.get('/lecturers/render/schedules/:id', verifyLecturer, lecturerRender.renderSchedules);
router.get('/lecturers/render/classrooms/:id', verifyLecturer, lecturerRender.renderClassrooms);
router.get('/lecturers/render/live/:id', verifyLecturer, lecturerRender.renderLive);
router.get('/lecturers/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);
router.get('/lecturers/render/classroom/:id', verifyLecturer, lecturerRender.renderClassroom);
router.get('/lecturers/render/profiles/lecturer/:id', verifyLecturer, lecturerRender.renderViewLecturerProfile);

export default router;