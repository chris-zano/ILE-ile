import express from "express";
import { v4 as uuidv4 } from "uuid"
import { verifyStudent } from "../admin/router.utils.js";
import { setUpRoom } from "../../controllers/lecturer/rtc.controller.js";

const router = express.Router();
router.get('/students/start-live/:id/:courseId', verifyStudent, (req, res) => {
    const {studentData} = req;
    res.redirect(`/${req.params.courseId}`);
});

export default router;