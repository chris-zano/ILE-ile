import express from 'express'
import path from 'path'
import multer from 'multer'
import { checkUsernamePattern } from './router.utils'
import { verifyAdmin } from './router.utils'
import * as adminController from '../../controllers/admin/admin.controller'
import * as usersController from '../../controllers/admin/admin.users';

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


export default router;