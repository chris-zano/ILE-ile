import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { verifyUser } from './router.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { AdminsDB, LecturersDB, StudentsDB } from '../../utils/global/db.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const router = express.Router();
const Admins = AdminsDB();
const Tutors = LecturersDB();
const Students = StudentsDB();

const adminProfilePictureUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'profile_pictures', 'users'),
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
    }
});

const userTypes = ["student", "lecturer", "admin"];

//admins profile updates
router.post('/:user/profile/update-component/profile-picture/:id',
    verifyUser,
    (req, res, next) => {
        adminProfilePictureUploads.single("profile_picture")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).json({ message: err.message });
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).json({ message: err.message });
            }
            next();
        });
    },
    async (req, res) => {
        const { user } = req.params;
        const userMethods = { "admin": Admins, "lecturer": Tutors, "student": Students };
        if (!userTypes.includes(user)) return res.status(400).redirect('/global/error');

        const { file } = req;
        if (!file) return res.status(400).json("No file uploaded");

        const { filename } = req.file;
        try {
            const userIDMap = `${user}Data`;
            const userdata = req[userIDMap] || null;
            const userDb = userMethods[user];

            if (!userDb) return res.status(404).render('global/error', { error: "Requested Resource Not Found", status: 404 });

            if (!userdata || !userdata.id) return res.status(403).render('global/error', { error: "Unauthorised access. Invalid userId", status: 403 });

            const id = userdata.id;
            const profilePicRoute = `/users/${user}s/get-profile-picture/${id}/${filename}`;
            await userDb.findByIdAndUpdate({ _id: id }, { $set: { profilePicUrl: profilePicRoute } });

            if (user === "student") {
                return res.status(200).redirect(`/${user}s/render/profile/${id}`);
            }
            return res.status(200).redirect(`/${user}s/render/profiles/${user}/${id}`);
        } catch (err) {
            logError(err);
            return res.status(500).json("Internal Server Error");
        }
    }
);

export default router;