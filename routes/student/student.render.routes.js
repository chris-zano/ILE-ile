const express = require('express');
const router = express.Router();

//application imports
const {verifyLecturer} = require('../admin/router.utils');
const lecturerRender = require('../../controllers/lecturer/lecturer.render');



//get lecturer interfaces
router.get('/students/render/dashboards/:id', verifyLecturer, lecturerRender.renderDashboard);
router.get('/students/render/courses/:id', verifyLecturer, lecturerRender.renderCourses);
router.get('/students/render/schedules/:id', verifyLecturer, lecturerRender.renderSchedules);
router.get('/students/render/classrooms/:id', verifyLecturer, lecturerRender.renderClassrooms);
router.get('/students/render/live/:id', verifyLecturer, lecturerRender.renderLive);
router.get('/students/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);
router.get('/students/render/classroom/:id', verifyLecturer, lecturerRender.renderClassroom);
router.get('/students/render/profiles/lecturer/:id', verifyLecturer, lecturerRender.renderViewLecturerProfile);

module.exports = router;