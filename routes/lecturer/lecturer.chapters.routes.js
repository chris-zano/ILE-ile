const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

//application imports
const {verifyLecturer} = require('../admin/router.utils');
const chaptersController = require('../../controllers/lecturer/chapters.controller');

const materialsUploads = multer({
    dest: path.join(__dirname, '..', '..', 'ITLE_FS', 'materials')
});

router.get('/lecturer/courses/addchapter/:courseId/:v/:id', verifyLecturer, chaptersController.addChapter);

router.post('/lecturer/courses/addLesson/:courseId/:v/:id', materialsUploads.single('lessonFile') , verifyLecturer, chaptersController.addLesson);

module.exports = router;