import express from 'express';
import { createNewRoom, leaveRoom, renderHome } from '../../controllers/rtc/rtc.controller.js';
import { CoursesDB, LecturersDB, StudentsDB } from '../../utils/global/db.utils.js';
import { logError } from '../../controllers/admin/admin.utils.js';
import { isValidObjectId } from 'mongoose';
import { getTurnCredentials } from '../../requireStack.js';
const router = express.Router();
const Courses = CoursesDB();
const Lecturers = LecturersDB()
const Students = StudentsDB()

router.get('/start-live/:courseId/:chapter', renderHome);
router.get('/room/:courseId/:chapter', createNewRoom);
router.get('/call/end/:room/:chapter', leaveRoom);

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

const generateLectureRecordingData = (chapter, startTime, stopTime, attendees) => {
    try {
        const recordedDate = {
            startTime: startTime,
            endTime: stopTime
        }
        const duration = startTime ? Number(stopTime) - Number(startTime) : null;
        const recordingObj = {
            title: `Chapter ${Number(chapter) + 1}- Lecture Recording`,
            dateRecorded: recordedDate,
            duration: duration,
            fileUrl: "",
            attendance: attendees
        }

        return recordingObj;
    } catch (error) {
        logError(error);
        return null;
    }
}

const resetCourseCallAttendance = async (courseId) => {
    if (!isValidObjectId(courseId)) return false;

    try {
        await Courses.findOneAndUpdate({ _id: courseId }, { $set: { attendance: [], meeting_status: 'not in meeting', call_start: 0 } });
        return true
    } catch (error) {
        logError(error);
        return false;
    }
}

router.post('/rtc/update-call-info/:callId/:chapter', async (req, res) => {
    const { callId, chapter } = req.params;
    const { attendees } = req.body;

    if (!callId || !isValidObjectId(callId)) return res.status(400).json({
        message: "The request you made is either incomplete or invalid. Check the request again.",
        status: 400,
    });

    try {

        
        let startTime = await Courses.findOne({ _id: callId }, { call_start: 1 });
        if (!startTime) startTime = null;
        
        // clear attendees section for the course.
        const attendaceIsReset = await resetCourseCallAttendance(callId);
        if (!attendaceIsReset) return res.status(404).json({ message: "Resource not found" });

        const recordingObject = generateLectureRecordingData(chapter, startTime ? startTime.call_start : null, new Date().getTime(), attendees);

        const course = await Courses.findOneAndUpdate(
            { _id: callId },
            {
                $addToSet: { [`chapters.${chapter}.courseLectureRecordings`]: recordingObject },
                $set: {
                    meeting_status: "not in meeting",
                    call_start: 0
                },
                $inc: { v: 1 }
            },
            { new: true });

        if (!course) return res.status(404).json({ message: "Resource not found" });

        return res.status(200).json({
            message: "Success",
            status: 200,
        });

    } catch (error) {
        logError(error);
        return res.status(500).json({
            message: "An error occured while processing your request. This might be an internal issue.",
            status: 500,
        })
    }
});

router.get('/rtc/course/info', async (req, res) => {
    if (!req.query || Object.keys(req.query).length === 0) {
        console.log("No query parameters found", req.query);
        return res.status(400).json({ message: 'query parameters are required for this operation', doc: {} });
    }
    const courseId = req.query.id;
    try {

        const course = await Courses.findOne({ _id: courseId }, { title: 1, courseCode: 1, attendance: 1, meeting_status: 1, credit: 1 });

        if (!course) return res.status(404).json({ message: 'resource not found', doc: {} });
        return res.status(200).json({ message: 'success', doc: course });

    } catch (error) {
        console.log("and error occured while fethcing course info [courseId] = ", courseId);
        logError(error);
        return res.status(500).json({ message: 'an unexpected error occured while fetching course information', doc: {} });
    }
})

router.get('/rtc/user/info', async (req, res) => {
    if (!req.query || Object.keys(req.query).length === 0) {
        console.log("No query parameters found", req.query);
        return res.status(400).json({ message: 'query parameters are required for this operation', doc: {} });
    }
    const { id, type } = req.query;
    try {
        let userData = null;

        if (type === 'lecturer') {
            userData = await Lecturers.findOne({ _id: id }, { firstName: 1, lastName: 1, profilePicUrl: 1 });
        }
        else if (type === 'student') {
            userData = await Students.findOne({ _id: id }, { firstName: 1, lastName: 1, studentId: 1, profilePicUrl: 1, session: 1 });
        }
        else {
            return res.status(400).json({ message: 'query parameters are required for this operation', doc: {} });
        }
        if (!userData) return res.status(404).json({ message: 'resource not found', doc: {} });

        return res.status(200).json({ message: 'success', doc: { ...userData._doc, type } });

    } catch (error) {
        console.log("and error occured while fethcing course info [courseId] = ", id);
        logError(error);
        return res.status(500).json({ message: 'an unexpected error occured while fetching course information', doc: {} });
    }
});

router.get('/courses/rtc/attendance', async (req, res) => {
    if (!req.query || Object.keys(req.query).length === 0) return res.status(400);

    const { id, chapter } = req.query;

    if (!id || !isValidObjectId(id) || !chapter) return res.status(400);

    try {
        const course = await Courses.findOne({ _id: id }, { chapters: 1 });
        const data = course.chapters[chapter] ? course.chapters[chapter].courseLectureRecordings : [];

        return res.status(200).render('global/attendance', { data });
    } catch (error) {
        logError(error)
        return res.status(500);
    }
});

router.get('/rtc/turn/get-credentials', (req, res) => {
    try {
        const turnCredentials = getTurnCredentials();

        if (!turnCredentials) {
            return res.status(404).json({data: null});
        }

        return res.status(200).json({data: turnCredentials});
    } catch (error) {
        logError(error);
        return res.status(500).json({data: null});
    }
})

export default router;