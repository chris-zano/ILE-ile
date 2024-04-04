const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const adminStaticController = require('../../controllers/admin/admin.static');
const adminUsersController = require('../../controllers/admin/admin.users');
const adminCoursesController = require('../../controllers/admin/admin.courses');

const adminRender = require('../../controllers/admin/admin.render');

const path = require('path');
const multer = require('multer');
const userJSONUpload = multer({
    dest: path.join(__dirname, '..', '..', 'models/imports')
});

//get requests
router.get('/admin/dashboards', adminStaticController.renderDashboard);
router.get('/admin/logins/:action', adminStaticController.renderAdminLogin);
router.get('/admin/users/import/:victim', adminStaticController.renderUserImportPage);
router.get('/admin/get/:userType/:offset', adminUsersController.getUserDataByOffset);
router.get('/admin/students/get/:action', adminUsersController.getStudentData);

//forge requests go here
// router.get('/forge/dashboard')
// router.get('/forge/lecturers/:prop/:action/:_id', forge.forgeLecturerRoutes);
//courses
router.get('/admin/courses/:action', adminCoursesController.manageCoursesViews);
router.post('/admin/courses/:action', adminCoursesController.manageCourses);
router.post('/admin/imports/course/students',userJSONUpload.single('file'), adminCoursesController.importStudentToCourse);


//post requests
router.post('/auth/admins/loginwithusernameandpassword', adminStaticController.authLoginRequest);
router.post('/admins/create_new_admnistrator',adminStaticController.createNewAdmin);
router.post('/admins/update_admin',adminStaticController.updateAdminInformation);
router.post('/admins/delete_admin',adminStaticController.deleteAdmin);

//users post
router.post('/admin/users/createOne', adminUsersController.createStudent);
router.post('/admin/users/createMany', userJSONUpload.single('file'), adminUsersController.importStudentsData);


router.get('/admin/render/imports/:userType/:id', adminRender.renderImports);

//export the router instance
module.exports = router;