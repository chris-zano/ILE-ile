import express from 'express';
import { verifyStudent } from '../admin/router.utils';
import * as renderStudentViews from '../../controllers/student/student.render.controller';

const router = express.Router();
router.get('/students/render/:pageUrl/:id', verifyStudent, renderStudentViews);
// router.get('/students/render/course/:courseId/:id', verifyStudent, lecturerRender.renderCourse);

export default router;