import { CoursesDB, LecturersDB, QuizSubs, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js'
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
const QuizSub = QuizSubs();


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

export const deleteStudentSub = async (req, res) => {
    const {studentData} = req;
    if (!req.query || Object.keys(req.query).length == 0) {
        console.log('request has some missing params', req.query);
        return res.status(400).redirect(`/students/render/submissions/${studentData.id}`);
    }

    try {
        const { subId } = req.query;

        if (!subId) {
            console.log('request has some missing params', req.query);
            return res.status(400).redirect(`/students/render/submissions/${studentData.id}`);
        }

        await Submission.findOneAndUpdate({ _id: subId }, {
            $pull: {
                studentSubmissions: { id: studentData.id }
            }
        });

        return res.status(202).redirect(`/students/render/submissions/${studentData.id}`)
    } catch (error) {
        logError(error);
        return res.status(500).redirect(`/students/render/submissions/${studentData.id}`)
    }
}

export const addQuizSubmission = async (req, res) => {
    if (!req.query || Object.keys(req.query).length !== 3) {
        console.log('request has some missing params', req.query);
        return res.status(400).json({ message: "missing query params" });
    }

    if (!req.body || Object.keys(req.body).length !== 2) {
        console.log('request has some missing params', req.body);
        return res.status(400).json({ message: "missing request body" });
    }

    try {
        const { sid, qid, code } = req.query;

        if (!sid || !qid || !code) {
            console.log("Missing query Params: ", { sid, qid, code })
            return res.status(400).json({ message: "missing query params" })
        }

        const { responses, score } = req.body;

        if ((!responses || responses.length === 0) || !score) {
            console.log({ responses, score });
            return res.status(400).json({ message: "missing query params" })
        }

        const docs = await QuizSub.find({ quiz_id: qid, student_id: sid }, { _id: 1 });

        if (!docs || docs.length === 0) {
            const newStudentSubmission = new QuizSub({
                courseCode: code,
                quiz_id: qid,
                student_id: sid,
                responses: responses,
                score: score
            });
            await newStudentSubmission.save();
            return res.status(200).json({ message: "saved" });
        }

        return res.status(202).json({ message: 'acknowleged' });
    } catch (error) {
        logError(error);
        res.status(500).json({ message: "internal server error" });
    }
}