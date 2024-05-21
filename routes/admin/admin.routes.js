const express = require('express');
const router = express.Router();

const adminUsersController = require('../../controllers/admin/admin.users');
const { verifyAdmin } = require('./router.utils');
const adminCoursesController = require('../../controllers/admin/admin.courses');

//get requests
router.get('/admin/get/:userType/:offset', adminUsersController.getUserDataByOffset);
router.get('/admin/students/get/:action', adminUsersController.getStudentData);
router.get('/admin/lecturers/get/:action', adminUsersController.getLecturersData);

router.get("/admins/user/get-lecturers-name/:id", adminUsersController.getLecturersName);
//courses
router.get('/admin/courses/get-courses/:id', verifyAdmin, adminCoursesController.getCoursesByOffset);


//post requests
router.post('/admins/update/course/:courseId/:id', verifyAdmin,adminCoursesController.manageCourses);

module.exports = router;