const express = require('express');
const path = require('path');

const router = express.Router();
const adminFileHandler = require('../../controllers/admin/admin.files');

//get scripts
router.get('/script/scripts/:auth/:filename', adminFileHandler.loadScript);
router.get('/script/utils/:auth/:filename', adminFileHandler.loadUtilityScript);

//get stylesheets
router.get('/css/:auth/:filename', adminFileHandler.getStyleSheet);

router.get('/images/system/:filename', adminFileHandler.getSystemImage);
router.get('/images/:filename', adminFileHandler.getImage);
router.get('/random/image/',adminFileHandler.getRandomImage);
router.get('/favicon', adminFileHandler.getFavicon);
router.get('/fonts/:filename', adminFileHandler.getFonts);
router.get('/users/:userType/get-profile-picture/:id', adminFileHandler.getDefaultProfilePicture);

//export the router instance
module.exports = router;