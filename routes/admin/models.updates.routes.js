const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyAdmin } = require('./router.utils');
const { logError } = require('../../controllers/admin/admin.utils');
const adminModels = require('../../models/admin/admin.models');

const adminProfilePictureUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users', 'admin')
});

//admins profile updates
router.post('/admins/profile/update-component/profile-picture/:id', verifyAdmin, adminProfilePictureUploads.single("profile_picture"), async (req, res) => {
    const id = req.adminData.id;
    const profilePicPath = path.resolve(req.file.path);

    if (fs.existsSync(profilePicPath)) {
        try {
            const savedData = await adminModels.updateOne({ _id: id }, { $set: { profilePicUrl: profilePicPath } });
            console.log(savedData);

            if (savedData.acknowledged === true && savedData.modifiedCount === 1) {
                res.status(200).json("success");
            }
        } catch (err) {
            logError(err);
            res.status(500).json("Internal Server Error");
        }
    }
    else {
        res.status(404).json("File not found");
    }
})

module.exports = router;