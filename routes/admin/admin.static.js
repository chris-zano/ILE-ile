const express = require('express');
const path = require('path');

const router = express.Router();
const adminStaticController = require('../../controllers/admin/admin.static');

//get requests
router.get('/admin/dashboard', adminStaticController.renderDashboard);
router.get('/admin/login', adminStaticController.renderAdminLogin);


//post requests
router.post('/auth/admin/loginwithusernameandpassword', adminStaticController.authLoginRequest);


//export the router instance
module.exports = router;