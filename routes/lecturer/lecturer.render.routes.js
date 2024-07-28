import express from 'express';
const router = express.Router();

//application imports
import {verifyLecturer} from '../admin/router.utils.js';
import * as lecturerRender from '../../controllers/lecturer/lecturer.render.controller.js';



//get lecturer interfaces
router.get('/lecturers/render/:pageUrl/:id', verifyLecturer, lecturerRender.renderLecturerViews);
router.get('/lecturers/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);

export default router;