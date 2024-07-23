import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import {verifyLecturer} from '../admin/router.utils.js';
import * as chaptersController from '../../controllers/lecturer/chapters.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

const materialsUploads = multer({
    dest: path.join(__dirname, '..', '..', 'ITLE_FS', 'materials')
});

router.get('/lecturer/courses/addchapter/:courseId/:v/:id', verifyLecturer, chaptersController.addChapter);
router.get('/lecturer/courses/deleteChapter/:courseId/:v/:id/:chapter', verifyLecturer, chaptersController.deleteChapter);
router.post('/lecturer/courses/addLesson/:courseId/:v/:id', materialsUploads.single('lessonFile') , verifyLecturer, chaptersController.addLesson);

export default router;