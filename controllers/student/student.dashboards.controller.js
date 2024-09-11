import { AnnouncementsDB, ClassesDB, CoursesDB, QuizDB, QuizSubs, RegisteredCoursesDB, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js';
import { getNearestEvents } from './dashboards.helpers.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const Students = StudentsDB()
const Submissions = SubmissionsDB();
const QuizSubmissions = QuizSubs();

export const getEvents = async (uid, classId) => {
    try {
        const schedulesArray = await Classes.find({ classId: `${classId}` }, { schedule: 1, _id: 0 });

        const schedules = schedulesArray.flatMap(doc => doc.schedule);

        if (!schedules || schedules.length === 0) {
            return [];
        }

        // Get the nearest events
        const nearestEvents = getNearestEvents(schedules);

        // Fetch course details and update events
        const updatedEvents = await Promise.all(nearestEvents.map(async event => {
            const courseDetails = await Courses.findOne({ courseCode: event.course }, { title: 1, _id: 1 });
            return { ...event, course: courseDetails };
        }));

        return updatedEvents;
    } catch (error) {
        logError('Error getting schedules', error);
    }
};

export const getCourses = async (uid, classId) => {
    try {
        const studentCourseCodes = await Students.findOne({ _id: uid }, { courses: 1, _id: 0 });
        if (!studentCourseCodes) {
            return []
        }

        const courseCodes = studentCourseCodes.courses;
        const courseDetails = await Promise.all(courseCodes.map(async code => {
            const data = await Courses.findOne({ courseCode: code }, { title: 1, students: 1, _id: 1 });
            if (!data) {
                return;
            }
            return data;
        }))
        return courseDetails;
    } catch (error) {
        logError('Error getting schedules', error);
    }
};

export const getSubmissions = async (uid) => {
    try {
        console.log("Fetching submissions for:", uid);

        // Fetch the submissions for the given UID
        const submissionData = await Submissions.findOne({ "studentSubmissions.id": uid });

        if (!submissionData) {
            throw new Error("No submission data found for this student.");
        }

        const { lecturerSubmission, studentSubmissions } = submissionData;
        const studentSubmissionsMade = studentSubmissions.map(sub => {
            return sub.subId
        });

        const now = new Date();
        // Count total submissions
        const totalSubmissions = lecturerSubmission.map(sub => {
            if (now > new Date(sub.startDate.date)) {
                const isSubmitted = studentSubmissions.some(studentSub => studentSub.subId.toString() === sub._id.toString());

                return {
                    ...sub.toObject(),
                    submitted: isSubmitted
                };
            }
            // Return null or omit if the start date is in the future
            return null;
        }).filter(sub => sub !== null);

        // Count student submissions

        // Identify unreleased submissions
        const unreleasedSubmissions = lecturerSubmission.filter(submission => {
            const endDate = new Date(submission.endDate.date);
            return endDate > now; // Submission is unreleased if endDate is in the future
        });

        const totalUnreleased = unreleasedSubmissions.length;

        return {
            totalSubmissionsMade: studentSubmissionsMade.length,
            totalSubmissionsAvailable: totalSubmissions,
            totalUnreleasedSubmissions: totalUnreleased
        };

    } catch (error) {
        console.error("Error fetching submissions:", error);
        return { error: "Failed to fetch submissions" };
    }
};

//TODO: work on this
export const getQuizReport = async (uid, classId) => {
    try {
        // Find all quiz submissions for the given student ID and course
        const submissions = await QuizSubmissions.find({ student_id: uid });

        if (submissions.length === 0) {
            return { message: 'No submissions found for this student' };
        }

        // Initialize result array
        const result = [];

        // Process each submission
        console.log('here')
        for (const submission of submissions) {
            const { quiz_id, responses, score } = submission;
            console.log('submission', submission);
            console.log({})

            // Aggregate data for each quiz
            console.log('here-----1');
            const quizData = {
                quizId: quiz_id,
                totalQuestions: responses.length,
                score: score
            };

            result.push(quizData);
        }
        console.log('here-----2');

        // Initialize counters
        let totalQuestions = 0;
        let correctAnswers = 0;

        // Aggregate responses
        const allResponses = submissions.flatMap(submission => submission.responses);

        // Calculate score and format responses
        const formattedResponses = allResponses.map(response => {
            totalQuestions++; // Count each question
            let correctAnswer = null;

            if (Object.keys(response).includes('question')) {
                correctAnswer = response.question.correctAnswer;
            }

            else {
                correctAnswer = response.answer
            }

            const isCorrect = response.answer === correctAnswer.toLowerCase();
            if (isCorrect) {
                correctAnswers++;
            }

            return {
                providedAnswer: response.answer,
                correctAnswer: correctAnswer,
                isCorrect
            };
        });

        return {
            submissions: result,
            report: {
                score: correctAnswers,
                totalQuestions: totalQuestions,
                responses: formattedResponses
            }
        };

    } catch (error) {
        console.log(error);
        // logError('Error getting quizzes', error);
        // throw new Error('Failed to retrieve quiz report');
    }
};

