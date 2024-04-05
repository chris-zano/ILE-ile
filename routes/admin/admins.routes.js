const express = require('express');
const router = express.Router();

const { authenticateLoginSequence } = require('./router.utils');
const adminController = require('../../controllers/admin/admin.controller');

router.post('/auth/users/login', authenticateLoginSequence, adminController.loginUser);

module.exports = router;