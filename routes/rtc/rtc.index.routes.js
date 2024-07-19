import express from 'express';
import { createNewRoom, leaveRoom, renderHome } from '../../controllers/rtc/rtc.controller.js';
import { CoursesDB } from '../../utils/global/db.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { isValidObjectId } from 'mongoose';
const router = express.Router();
const Courses = CoursesDB();

router.get('/start-live/:courseId', renderHome);
router.get('/room/:courseId', createNewRoom);
router.get('/room/end/:room', leaveRoom);
router.get('/get/class-in-session/:courseId', async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) return res.status(400).json({ message: "Invalid request" });
    try {
        const course = await Courses.findOne({ _id: courseId });

        if (!course) return res.status(404).json({ message: "course not found" });

        return res.status(200).json({ message: "course found", doc: course });
    } catch (error) {
        console.log(error)
        logError(error);
        return res.status(500).json({ message: "Internal server error" })
    }
});

router.get('/rtc/get-participants/:courseId', async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) return res.status(400).json({ message: "Invalid request", doc: {} });

    try {
        const course = await Courses.findOne({ _id: courseId });

        if (!course) return res.status(404).json({ message: "Document not found", doc: {} });

        return res.status(200).json({ message: "get success", doc: course.attendance });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: "Internal Server error", doc: {} });
    }
});

router.post('/rtc/add-participant/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const { participant } = req.body;

    if (!courseId || !participant) return res.status(400).json({ message: "Invalid request", doc: {} });

    try {
        const course = await Courses.findOneAndUpdate({ _id: courseId }, { $addToSet: { attendance: participant } }, { new: true });

        if (!course) return res.status(404).json({ message: "Document not found", doc: {} });

        return res.status(200).json({ message: "data updated", doc: course.attendance });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: "Internal Server error", doc: {} });
    }
});

router.post('/rtc/update-call-info/:callId', async (req, res) => {
    const { callId } = req.params;

    if (!callId || !isValidObjectId(callId)) return res.status(400).json({
        message: "The request you made is either incomplete or invalid. Check the request again.",
        status: 400,
        document: {}
    });

    try {
        const course = await Courses.findOne({_id: callId});
        if (!course) return res.status(404).json({
            message: "The requested resource is does not exist. Please check your request again.",
            status: 404,
            document:{}
        });

        console.log(course);

        return res.status(200).json({
            message: "Success",
            status: 200,
            document: {}
        })
        
    } catch (error) {
        logError(error);
        return res.status(500).json({
            message: "An error occured while processing your request. This might be an internal issue.",
            status: 500,
            document: {}
        })
    }
})

export default router;
