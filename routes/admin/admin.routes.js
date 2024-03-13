const express = require('express');
const path = require('path');

const router = express.Router();
const adminStaticController = require('../../controllers/admin/admin.static');

//get requests
router.get('/admin/dashboard', adminStaticController.renderDashboard);
router.get('/admin/logins/:action', adminStaticController.renderAdminLogin);


//post requests
router.post('/auth/admins/loginwithusernameandpassword', adminStaticController.authLoginRequest);
router.post('/admins/create_new_admnistrator',adminStaticController.createNewAdmin);


//export the router instance
module.exports = router;