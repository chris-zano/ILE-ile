import { CoursesDB, LecturersDB, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js'
import { logError } from '../admin/admin.utils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import { convertToMilliseconds, getStartDate } from './submission.utils.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const Student = StudentsDB();
const Lecturer = LecturersDB();
const Courses = CoursesDB();
const Submission = SubmissionsDB();


const generateNewSubmissionObject = ({ lecturerId, submissionObject }) => {
    if (!submissionObject || Object.keys(submissionObject).length === 0) {
        return { status: false, doc: {} }
    }

    const { courseCode, title, instructions, startDate, endDate, expected, received, fileUrl } = submissionObject;

    const submission = { courseCode: courseCode, lecturer: lecturerId, lecturerSubmission: [] };
    submission.lecturerSubmission.push({ title, instructions, startDate, endDate, expected, received, fileUrl });


    return { status: true, doc: submission };
}

const updateLecturerSubmission = async ({ courseCode, lecturerSubmissionObject }) => {

    try {
        const submission = await Submission.findOneAndUpdate(
            { courseCode: courseCode },
            {
                $addToSet: { lecturerSubmission: lecturerSubmissionObject }
            },
            { new: true }
        );

        if (!submission) return { status: false, doc: {} }

        return { status: true, doc: submission }
    } catch (error) {
        logError(error)
        return false;
    }
}

/**
 * This middleware creates a new submission for a course and saves it in the Submissions collection
 * @param {Object} req the incoming request
 * @param {Object} res the outgoing response
 * @return {Promise<response>}
 */
export const createSubmission = async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }

    const submissionObject = req.body;
    const { lecturerData } = req;

    submissionObject['fileUrl'] = {
        originalname: 'originalname',
        filename: "",
        fileUrl: `/submissions/get-file/no-filename`
    }

    try {
        let submission = undefined;
        const existingSubmission = await Submission.findOne({ courseCode: submissionObject.courseCode });
        if (!existingSubmission) {
            //submission does not exist. Create a new one.
            submission = generateNewSubmissionObject({ lecturerId: lecturerData.id, submissionObject });
            if (!submission.status) return res.status(400).json({ message: 'resource could not be created' });
            const { doc } = submission;
            const newSubmission = new Submission({
                courseCode: submissionObject.course_code,
                lecturer: doc.lecturer,
                lecturerSubmission: doc.lecturerSubmission,
                studentSubmissions: []
            });

            const savedDocument = await newSubmission.save();
            return res.status(200).json({ message: 'success' });
        }
        const updatedDocument = await updateLecturerSubmission({ courseCode: submissionObject.courseCode, lecturerSubmissionObject: submissionObject });

        return res.status(200).json({ message: 'post request ok!. submission will be created soon' })
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: 'An error occured while processing your request' })
    }

}



export const createSubmissionWithFile = async (req, res) => {

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
    }
    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
    }

    const { lecturerData } = req;
    const { filename, originalname } = req.file;
    const submissionObject = req.body;

    const startDate = getStartDate(submissionObject['start-date']);
    const endDate = getStartDate(submissionObject['end-date']);

    submissionObject['start-date'] = {
        date: startDate,
        timeStamp: convertToMilliseconds(startDate)
    };

    submissionObject['end-date'] = {
        date: endDate,
        timeStamp: convertToMilliseconds(endDate)
    }

    submissionObject['fileUrl'] = {
        originalname: originalname,
        filename: filename,
        fileUrl: `/submissions/get-file/${filename}`
    }

    try {
        let submission = undefined;
        //find existing submission
        const existingSubmission = await Submission.findOne({ courseCode: submissionObject.course_code });

        if (!existingSubmission) {
            //submission does not exist. Create a new one.

            submission = generateNewSubmissionObject({ lecturerId: lecturerData.id, submissionObject });
            if (!submission.status) return res.status(400).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
            const { doc } = submission;

            const newSubmission = new Submission({
                courseCode: submissionObject.course_code,
                lecturer: doc.lecturer,
                lecturerSubmission: doc.lecturerSubmission,
                studentSubmissions: []
            });

            const savedDocument = await newSubmission.save();
            return res.status(200).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
        }
        const updatedDocument = await updateLecturerSubmission({ courseCode: submissionObject.course_code, lecturerSubmissionObject: submissionObject });
        return res.status(200).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
    } catch (error) {
        logError(error);
        return res.status(500).redirect(`/lecturers/render/submissions/${req.lecturerData.id}`);
    }
}

export const getLecturerSubmissionForCourseCode = async (req, res) => {
    const { courseCode } = req.params;
    if (!courseCode) return res.status(400).json({ message: 'failed', doc: {} });
    try {
        const doc = await Submission.findOne({ courseCode: courseCode });
        if (!doc) return res.status(404).json({ message: 'resource not found', doc: {} });

        return res.status(200).json({ message: 'success', doc: doc });
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: 'internl server error', doc: {} });
    }
}

export const deleteStudentSubmissions = async (req, res) => {
    const { courseCode, subId } = req.params;

    if (!courseCode || !subId) return res.status(400).json({ message: 'invalid request' });
    try {

        const updatedDocument = await Submission.findOneAndUpdate(
            { courseCode: courseCode },
            {
                $pull: { lecturerSubmission: { _id: subId } }
            },
            { new: true }
        );

        return res.status(200).json({ message: 'resource deletion complete', doc: updatedDocument});
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: 'failed ot delete. internal server error' });
    }
}