/**
 * @module submissionsModule
 */

import express from 'express';
import { verifyLecturer } from '../admin/router.utils.js'
import { createSubmission, createSubmissionWithFile, deleteStudentSubmissions, getLecturerSubmissionForCourseCode } from '../../controllers/submission/submission.controller.js';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();

const submissionsUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'submissions'),
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx|ppt|pptx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
});


router.post('/submissions/create-with-file/:id',
    verifyLecturer,
    (req, res, next) => {
        submissionsUploads.single("submission-file")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    createSubmissionWithFile);

router.post('/submissions/create/:id', verifyLecturer, createSubmission);

router.delete('/submissions/delete/:courseCode/:subId/:id', verifyLecturer, deleteStudentSubmissions)
router.get('/submissions/get/:courseCode/:id', verifyLecturer, getLecturerSubmissionForCourseCode);

export default router;