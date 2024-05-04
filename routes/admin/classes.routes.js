const express = require('express');
const router = express.Router();

const classController = require('../../controllers/admin/class.controller');
const { verifyAdmin } = require('./router.utils');

router.get('/admin/classes/create/:id', verifyAdmin, classController.runCreateClasses);

module.exports = router;