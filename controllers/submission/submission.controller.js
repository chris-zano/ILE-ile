import { CoursesDB, LecturersDB, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js'
import { logError } from '../admin/admin.utils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const Student = StudentsDB();
const Lecturer = LecturersDB();
const Courses = CoursesDB();
const Submission = SubmissionsDB();


const generateNewSubmissionObject = ({ courseCode, lecturerId, submissionObject }) => {
    if (!submissionObject || Object.keys(submissionObject).length === 0) {
        return { status: false, doc: {} }
    }

    const { title, startDate, endDate, expected, received, fileUrl } = submissionObject;

    const submission = { courseCode: courseCode, lecturer: lecturerId, lecturerSubmission: [] };
    submission.lecturerSubmission.push({ title, startDate, endDate, expected, received, fileUrl });

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
    if (!body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is empty' });
    }

    let filename = undefined;
    if (req.route.path === '/submissions/create-with-file/:id' && (!req.file || Object.keys(req.file).length === 0)) {
        filename = req.file.filename;
        return res.status(400).json({ message: 'File upload might have failed' });
    }

    const { courseCode, lecturerId, submissionObject } = req.body;

    submissionObject.fileUrl = `/submissions/get-file/${filename ? filename : 'no-filename'}`;

    try {
        let submission = undefined;
        //find existing submission
        const existingSubmission = await Submission.findOne({ courseCode: courseCode });

        if (!existingSubmission) {
            //submission does not exist. Create a new one.
            submission = generateNewSubmissionObject({ courseCode, lecturerId, submissionObject });
            if (!submission.status) return res.status(400).json({ message: 'resource could not be created' });
            const { doc } = submission;

            const newSubmission = new Submission({
                courseCode: courseCode,
                lecturer: doc.lecturer,
                lecturerSubmission: doc.lecturerSubmission,
                studentSubmissions: []
            });

            const savedDocument = await newSubmission.save();
            console.log(savedDocument);

            return res.status(200).json({ message: 'success' });
        }

        const updatedDocument = await updateLecturerSubmission({ courseCode, lecturerSubmissionObject: submissionObject });

        console.log(updatedDocument);

        return res.status(200).json({ message: 'post request ok!. submission will be created soon' })
    } catch (error) {
        logError(error);
        return res.status(500).json({ message: 'An error occured while processing your request' })
    }

}