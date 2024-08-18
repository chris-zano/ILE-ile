import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';
import { checkUsernamePattern } from './router.utils.js';
import { verifyAdmin } from './router.utils.js';
import * as adminController from '../../controllers/admin/admin.controller.js';
import * as usersController from '../../controllers/admin/admin.users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const userJSONUpload = multer({
    dest: path.join(__dirname, '..', '..', 'models/imports')
});

/**
 * this route is for developers to create new admin accounts
 * this is not to be released or pushed to any remote repositories
 */
router.post('/developers/create-new-admin', usersController.createNewAdmin);

router.post('/auth/users/login', checkUsernamePattern, adminController.loginUser);
router.post('/admins/imports/students/:id', userJSONUpload.single('file'), verifyAdmin, usersController.importStudentsData);
router.post('/admins/imports/lecturers/:id', userJSONUpload.single('file'), verifyAdmin, usersController.importLecturersData);
router.post('/admins/create/students/:id', verifyAdmin, usersController.createStudent)
router.post('/admins/create/lecturers/:id', verifyAdmin, usersController.createLecturer);
router.post('/admins/update/students/:id', verifyAdmin, usersController.updateStudent)
router.post('/admins/update/tutors/:id', verifyAdmin, usersController.updateLecturer);


export default router;