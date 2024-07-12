import express from "express";
import { v4 as uuidv4 } from "uuid"
import { verifyLecturer } from "../admin/router.utils.js";
import { setUpRoom } from "../../controllers/lecturer/rtc.controller.js";

const router = express.Router();
router.get('/lecturers/start-live/:id', verifyLecturer, (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

router.get('/:room',(req, res) => {
    res.render('global/rtc-room', { roomId: req.params.room });
});

export default router;