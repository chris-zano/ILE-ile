import { CoursesDB, LecturersDB, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js'
import { logError } from '../admin/admin.utils.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from "fs";
import { convertToMilliseconds, getEndDate, getStartDate } from './submission.utils.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const Student = StudentsDB();
const Lecturer = LecturersDB();
const Courses = CoursesDB();
const Submission = SubmissionsDB();


export const addStudentSubmission = async (req, res) => {
    const { subId, lectSubId } = req.query;
    const { file } = req;
    const { studentData } = req;

    try {
        const newStudentSubmission = {
            id: studentData.id,
            subId: lectSubId,
            studentId: studentData.studentId,
            filename: file.originalname,
            fileUrl: `/submissions/get-file/${file.filename}`,
            date: new Date(),
            status: 'pending'
        }

        const updatedDoc = await Submission.updateOne(
            {
                _id: subId,
                "studentSubmissions.id": { $ne: newStudentSubmission.id }
            },
            { $addToSet: { studentSubmissions: newStudentSubmission } }
        );

        if (updatedDoc.modifiedCount === 0) {
            // Handle the case where no documents were modified
            console.log('No document found with the provided _id or the submission was already present.');
            return res.status(404).redirect(`/students/render/submissions/${studentData.id}`);
        }

        console.log('Student submission added successfully.');
        return res.status(200).redirect(`/students/render/submissions/${studentData.id}`);
    } catch (error) {
        logError(error);
        return res.status(500).redirect(`/students/render/submissions/${studentData.id}`)
    }
}