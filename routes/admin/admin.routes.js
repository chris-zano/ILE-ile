const express = require('express');
const path = require('path');

const router = express.Router();
const adminStaticController = require('../../controllers/admin/admin.static');
const adminUsersController = require('../../controllers/admin/admin.users');

const multer = require('multer');
const studentsDataUpload = multer({
    dest: path.join(__dirname, '..', '..', 'models/student/studentsDataImports')
});

//get requests
router.get('/admin/dashboards', adminStaticController.renderDashboard);
router.get('/admin/logins/:action', adminStaticController.renderAdminLogin);
router.get('/admin/users/import/:victim', adminStaticController.renderUserImportPage);


//post requests
router.post('/auth/admins/loginwithusernameandpassword', adminStaticController.authLoginRequest);
router.post('/admins/create_new_admnistrator',adminStaticController.createNewAdmin);

//users post
router.post('/admin/users/createOne', adminUsersController.createStudent);
router.post('/admin/users/createMany', studentsDataUpload.single('file'), adminUsersController.importStudentsData);


//export the router instance
module.exports = router;