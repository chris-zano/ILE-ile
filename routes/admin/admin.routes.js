import express from 'express';
import * as adminUsersController from '../../controllers/admin/admin.users.js';
import { verifyAdmin } from './router.utils.js';
import * as adminCoursesController from '../../controllers/admin/admin.courses.js';

const router = express.Router();
router.get('/admin/students/get/:action', adminUsersController.getStudentData);
router.get('/admin/get/:userType/:offset', adminUsersController.getUserDataByOffset);
router.get("/admins/user/get-lecturers-name/:id", adminUsersController.getLecturersName);
router.get('/admin/courses/get-courses/:id', verifyAdmin, adminCoursesController.getCoursesByOffset);
router.post('/admins/update/course/:courseId/:id', verifyAdmin, adminCoursesController.manageCourses);
router.get('/admins/delete/course/:courseId/:id', verifyAdmin, adminCoursesController.deleteCourse)
router.get("/admins/get/registration-code-courses/:id", verifyAdmin, adminCoursesController.getCoursesByRegistrationCode);
router.post("/admins/set/registration-code-courses/:id", verifyAdmin, adminCoursesController.setCoursesToRegistrationCode);
router.get("/admins/reset/registration-code-courses/:id", verifyAdmin, adminCoursesController.resetCoursesForRegistrationCode);

export default router;