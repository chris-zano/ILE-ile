import express from 'express';

const router = express.Router();
import * as adminFileHandler  from '../../controllers/admin/admin.files.js';


router.get('/script/scripts/:auth/:filename', adminFileHandler.loadScript);
router.get('/script/utils/:auth/:filename', adminFileHandler.loadUtilityScript);
router.get('/css/:auth/:filename', adminFileHandler.getStyleSheet);
router.get('/images/system/:filename', adminFileHandler.getSystemImage);
router.get('/images/:filename', adminFileHandler.getImage);
router.get('/random/image/', adminFileHandler.getRandomImage);
router.get('/favicon', adminFileHandler.getFavicon);
router.get('/fonts/:filename', adminFileHandler.getFonts);
router.get('/users/:userType/get-profile-picture/:id/:filename', adminFileHandler.getDefaultProfilePicture);
router.get('/submissions/get-file/:filename', adminFileHandler.getSubmissionFile)
router.get('/announcements/files/get', adminFileHandler.getAnnouncementFile)
router.get('/library/files/', adminFileHandler.getLibraryFile)

//export the router instance
export default router;