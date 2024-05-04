const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const { authenticateLoginSequence } = require('./router.utils');
const {verifyAdmin} = require('./router.utils');
const adminController = require('../../controllers/admin/admin.controller');
const usersController = require('../../controllers/admin/admin.users')

const userJSONUpload = multer({
    dest: path.join(__dirname, '..', '..', 'models/imports')
});


router.post('/auth/users/login', authenticateLoginSequence, adminController.loginUser);
router.post('/admins/imports/students/:id',userJSONUpload.single('file'), verifyAdmin, usersController.importStudentsData);
router.post('/admins/imports/lecturers/:id',userJSONUpload.single('file'), verifyAdmin, usersController.importLecturersData);
router.post('/admins/create/students/:id', verifyAdmin, usersController.createStudent)
router.post('/admins/create/lecturers/:id', verifyAdmin, usersController.createLecturer);


module.exports = router;