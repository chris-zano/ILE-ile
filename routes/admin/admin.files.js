const express = require('express');
const path = require('path');

const router = express.Router();
const adminFileHandler = require('../../controllers/admin/admin.files');

//get scripts
router.get('/script/scripts/:auth/:filename', adminFileHandler.loadScript);
router.get('/script/utils/:auth/:filename', adminFileHandler.loadUtilityScript);

//get stylesheets
router.get('/styles/css/:auth/:attribute/:filename', adminFileHandler.getStyleSheet)


//export the router instance
module.exports = router;