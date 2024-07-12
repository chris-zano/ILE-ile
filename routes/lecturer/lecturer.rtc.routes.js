import express from "express";
import { verifyLecturer } from "../admin/router.utils.js";
import { logError } from "../../controllers/admin/admin.utils.js";

const router = express.Router();
router.get('/lecturers/start-live/:id/:courseId', verifyLecturer, (req, res) => {
    res.redirect(`/${req.params.courseId}`);
});

router.get('/:room', async (req, res) => {
    try {
        return res.status(200).render('global/rtc-room', { roomId: req.params.room });
    } catch (error) {
        logError(error);
        return res.status(500).render('global/error', { status: 500, error: "Failed to start peer-peer server" });
    }
});

export default router;