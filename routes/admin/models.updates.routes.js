const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyAdmin } = require('./router.utils');
const { logError } = require('../../controllers/admin/admin.utils');

const adminProfilePictureUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users', 'admin')
});

//admins profile updates
router.post('/admins/profile/update-component/profile-picture/:id', verifyAdmin, adminProfilePictureUploads.single("profile_picture"), (req, res) => {
    console.log(req.files)
})

module.exports = router;