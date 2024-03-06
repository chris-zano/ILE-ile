const express = require('express');
const path = require('path');

const router = express.Router();

const adminStaticController = require('../../controllers/admin/admin.static');

router.get('/admin/dashboard', adminStaticController.renderDashboard);

module.exports = router;