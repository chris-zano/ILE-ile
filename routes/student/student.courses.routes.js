import express from "express";
import { verifyStudent } from "../admin/router.utils.js";
import { setCourseRegistration } from "../../controllers/student/student.courses.controller.js";

const router = express.Router();
router.post('/students/set/registration/:id', verifyStudent, setCourseRegistration)
router.get('/students/join/:id', verifyStudent, async (req, res) => {
    res.status(200).render('global/rtc-master')
});


export default router;