import { v4 as uuidv4 } from 'uuid'; //used to get unique room ids
import { CoursesDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js'

const Courses = CoursesDB();

const isCourseIdValid = async (id) => {
    try {
        const docExists = await Courses.exists({ _id: id });
        return docExists;

    } catch (error) {
        logError(error);
        console.log("Error checking if course exists for RTC call: ", id, docExists);
        return false
    }
}

export const renderHome = async (req, res) => {
    try {
        const { courseId,chapter } = req.params;

        if (!courseId) return res.status(403);

        const courseExists = await isCourseIdValid(courseId);
        if (!courseExists) return res.status(403);

        return res.render('global/rtc-home', { courseID: courseId, chapter });

    }
    catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const createNewRoom = async (req, res) => {
    try {
        const { courseId, chapter } = req.params;
        console.log(req.url);

        if (!courseId) return res.status(403).send("Forbidden: Course ID not provided");

        const courseExists = await isCourseIdValid(courseId);
        if (!courseExists) return res.status(403).send("Forbidden: Invalid Course ID");

        return res.status(200).render('global/room', { roomId: courseId , chapter});
    } catch (error) {
        logError(error);
        return res.status(500).send("Internal Server Error");
    }
};

export const leaveRoom = (req, res) => {
    return res.render('global/meeting_end', { roomId: req.params.room, chapter:req.params.chapter });
}