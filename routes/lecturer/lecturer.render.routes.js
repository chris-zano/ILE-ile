const express = require('express');
const router = express.Router();

//application imports
const {verifyLecturer} = require('../admin/router.utils');
const lecturerRender = require('../../controllers/lecturer/lecturer.render');



//get lecturer interfaces
router.get('/lecturers/render/dashboards/:id', verifyLecturer, lecturerRender.renderDashboard);
router.get('/lecturers/render/courses/:id', verifyLecturer, lecturerRender.renderCourses);
router.get('/lecturers/render/schedules/:id', verifyLecturer, lecturerRender.renderSchedules);
router.get('/lecturers/render/classrooms/:id', verifyLecturer, lecturerRender.renderClassrooms);
router.get('/lecturers/render/live/:id', verifyLecturer, lecturerRender.renderLive);
router.get('/lecturers/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);
router.get('/lecturers/render/classroom/:id', verifyLecturer, lecturerRender.renderClassroom);

module.exports = router;