import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verifyAdmin } from './router.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { AdminsDB } from '../../utils/global/db.utils.js';

const router = express.Router();
const Admins = AdminsDB();

const adminProfilePictureUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users', 'admin')
});

//admins profile updates
router.post('/admins/profile/update-component/profile-picture/:id', verifyAdmin, adminProfilePictureUploads.single("profile_picture"), async (req, res) => {
    const id = req.adminData.id;
    const profilePicPath = path.resolve(req.file.path);

    if (fs.existsSync(profilePicPath)) {
        try {
            const savedData = await Admins.updateOne({ _id: id }, { $set: { profilePicUrl: profilePicPath } });
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

export default router;