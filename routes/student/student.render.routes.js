const express = require('express');
const router = express.Router();

//application imports
const {verifyStudent} = require('../admin/router.utils');
const { renderStudentViews } = require('../../controllers/student/student.render.controller');



//get lecturer interfaces
router.get('/students/render/:pageUrl/:id', verifyStudent, renderStudentViews);
// router.get('/students/render/courses/:id', verifyStudent, lecturerRender.renderCourses);
// router.get('/students/render/schedules/:id', verifyStudent, lecturerRender.renderSchedules);
// router.get('/students/render/course/:courseId/:id', verifyStudent, lecturerRender.renderCourse);
// router.get('/students/render/classroom/:id', verifyStudent, lecturerRender.renderClassroom);
// router.get('/students/render/profiles/:id', verifyStudent, lecturerRender.renderViewLecturerProfile);

module.exports = router;