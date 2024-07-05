import express from 'express';
import * as adminUsersController from '../../controllers/admin/admin.users.js';
import { verifyAdmin } from './router.utils.js';
import * as adminCoursesController from '../../controllers/admin/admin.courses.js';

const router = express.Router();

router.get('/admin/get/:userType/:offset', adminUsersController.getUserDataByOffset);
router.get('/admin/students/get/:action', adminUsersController.getStudentData);
router.get("/admins/user/get-lecturers-name/:id", adminUsersController.getLecturersName);
router.get('/admin/courses/get-courses/:id', verifyAdmin, adminCoursesController.getCoursesByOffset);
router.post('/admins/update/course/:courseId/:id', verifyAdmin, adminCoursesController.manageCourses);
router.post("/admin/set/registration-code-courses/:id", verifyAdmin);

router.get("/admin/get/registration-code-courses/:id", verifyAdmin);
// router.get('/admin/lecturers/get/:action', adminUsersController.getLecturersData);

export default router;