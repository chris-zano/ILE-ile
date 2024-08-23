import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createNewAnnouncement, deleteAnnouncement } from '../../controllers/admin/admin.broadcast.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const announcementsUploads = multer({
    dest: path.join(__dirname, '..', '..', 'public', 'assets', 'announcements')
});
const router = express.Router();
router.post('/admins/announcements/create', announcementsUploads.array('attachments'), createNewAnnouncement);
router.delete('/admins/announcements/delete', deleteAnnouncement)
export default router;