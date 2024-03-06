const express = require('express');
const path = require('path');

const router = express.Router();
const adminFileHandler = require('../../controllers/admin/admin.files');

//get requests
router.get('/script/scripts/:auth/:filename', adminFileHandler.loadScript);
router.get('/script/utils/:auth/:filename', adminFileHandler.loadUtilityScript);


//export the router instance
module.exports = router;