import express from 'express';
const router = express.Router();

//application imports
import {verifyLecturer} from '../admin/router.utils.js';
import * as lecturerRender from '../../controllers/lecturer/lecturer.render.controller.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { getLecturerCourses, getLecturerEvents } from '../../controllers/lecturer/lecturer.dashboards.controller.js';



//get lecturer interfaces
router.get('/lecturers/render/:pageUrl/:id', verifyLecturer, lecturerRender.renderLecturerViews);
router.get('/lecturers/render/course/:courseId/:id', verifyLecturer, lecturerRender.renderCourse);

router.get('/dashboard/get-lecturer-data', async (req, res) => {
    try {
        const stdUid = req.headers['std-uid'];
        const xDataType = req.headers['x-data-type'];

        const dataToMethodMap = {
            "events": getLecturerEvents,
            "courses": getLecturerCourses
        }

        if (dataToMethodMap[xDataType]) {
            const result = await dataToMethodMap[xDataType](stdUid);
            res.status(200).json(result);
        } else {
            res.status(400).json({ error: "Invalid data type" });
        }

    } catch (error) {
        logError(error);
        res.status(500).json({ error: 'Failed to retrieve headers' });
    }
})

export default router;