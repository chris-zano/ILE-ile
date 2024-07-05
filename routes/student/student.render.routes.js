import express from 'express';
import { verifyStudent } from '../admin/router.utils.js';
import renderStudentViews from '../../controllers/student/student.render.controller.js';

const router = express.Router();
router.get('/students/render/:pageUrl/:id', verifyStudent, renderStudentViews);
// router.get('/students/render/course/:courseId/:id', verifyStudent, lecturerRender.renderCourse);

export default router;