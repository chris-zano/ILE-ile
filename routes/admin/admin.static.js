const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const router = express.Router();

const adminStaticController = require('../../controllers/admin/admin.static');

router.get('/admin/dashboard', adminStaticController.renderDashboard);

module.exports = router;