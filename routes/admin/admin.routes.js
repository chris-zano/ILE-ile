const express = require('express');
const path = require('path');

// eslint-disable-next-line new-cap
const router = express.Router();
const adminStaticController = require('../../controllers/admin/admin.static');
const adminUsersController = require('../../controllers/admin/admin.users');
const adminCoursesController = require('../../controllers/admin/admin.courses');


const multer = require('multer');

const studentsDataUpload = multer({
    dest: path.join(__dirname, '..', '..', 'models/student/studentsDataImports')
});

//get requests
router.get('/admin/dashboards', adminStaticController.renderDashboard);
router.get('/admin/logins/:action', adminStaticController.renderAdminLogin);
router.get('/admin/users/import/:victim', adminStaticController.renderUserImportPage);
router.get('/admin/get/:userType/:offset', adminUsersController.getUserDataByOffset);

//courses
router.get('/admin/courses/:action', adminCoursesController.manageCoursesViews);
router.post('/admin/courses/:action', adminCoursesController.manageCourses);
router.post('/admin/imports/course/students',studentsDataUpload.single('file'), adminCoursesController.importStudentToCourse);

//post requests
router.post('/auth/admins/loginwithusernameandpassword', adminStaticController.authLoginRequest);
router.post('/admins/create_new_admnistrator',adminStaticController.createNewAdmin);
router.post('/admins/update_admin',adminStaticController.updateAdminInformation);
router.post('/admins/delete_admin',adminStaticController.deleteAdmin);

//users post
router.post('/admin/users/createOne', adminUsersController.createStudent);
router.post('/admin/users/createMany', studentsDataUpload.single('file'), adminUsersController.importStudentsData);


//export the router instance
module.exports = router;