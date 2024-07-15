import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { verifyUser } from './router.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { AdminsDB } from '../../utils/global/db.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const Admins = AdminsDB();

const adminProfilePictureUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users', 'admin')
});
const userTypes = ["student", "lecturer", "admin"];

//admins profile updates
router.post('/:user/profile/update-component/profile-picture/:id',
    verifyUser,
    adminProfilePictureUploads.single("profile_picture"), async (req, res) => {
        const { user } = req.params;
        if (!userTypes.includes(user) || !filename) return res.status(400).redirect('/global/error');

        const { file } = req;
        if (!file) return res.status(400).json("No file uploaded");

        const { filename } = req.file;
        try {
            const userIDMap = `${user}Data`;
            const userdata = req[userIDMap] || null;

            if (!userdata || !userdata.id) return res.status(400).redirect('/global/error');
            const id = userdata.id;
            const profilePicRoute = `/users/${user}s/get-profile-picture/${id}/${filename}`;
            await Admins.findByIdAndUpdate({ _id: id }, { $set: { profilePicUrl: profilePicRoute } });

            return res.status(200).redirect(`/admins/render/profiles/admin/${id}`);
        } catch (err) {
            logError(err);
            return res.status(500).json("Internal Server Error");
        }
    }
)

export default router;