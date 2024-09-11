import express from "express";
import { verifyStudent } from "../admin/router.utils.js";
import { setCourseRegistration } from "../../controllers/student/student.courses.controller.js";
import { getCourses, getEvents, getQuizReport, getSubmissions } from "../../controllers/student/student.dashboards.controller.js";
import { logError } from "../../controllers/admin/admin.utils.js";

const router = express.Router();
router.post('/students/set/registration/:id', verifyStudent, setCourseRegistration)
router.get('/students/join/:id', verifyStudent, async (req, res) => {
    res.status(200).render('global/rtc-master')
});

router.get('/dashboard/get-student-data', async (req, res) => {
    try {
        const stdUid = req.headers['std-uid'];
        const xDataType = req.headers['x-data-type'];
        const classId = req.headers['x-class-id'];

        const dataToMethodMap = {
            "events": getEvents,
            "courses": getCourses,
            "submissions": getSubmissions,
            "quiz": getQuizReport
        }

        if (dataToMethodMap[xDataType]) {
            const result = await dataToMethodMap[xDataType](stdUid, classId);
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: "Invalid data type" });
        }

    } catch (error) {
        console.log(error)
        // logError("Error retrieving headers:", error);
        res.status(500).json({ error: 'Failed to retrieve headers' });
    }
})

export default router;