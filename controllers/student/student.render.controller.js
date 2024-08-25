import { isValidObjectId } from 'mongoose';
import { AnnouncementsDB, ClassesDB, CoursesDB, QuizDB, RegisteredCoursesDB, StudentsDB, SubmissionsDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const Students = StudentsDB()
const RegisteredCourses = RegisteredCoursesDB();
const Submissions = SubmissionsDB();
const Announcement = AnnouncementsDB();
const Quiz = QuizDB()

const getStudentDashboard = async (studentData) => {
    return {
        message: "This is the student dashboard for " + studentData.firstName
    };
}

const getStudentCourses = async (studentData) => {
    try {
        const courseCodes = studentData.courses;
        const coursesMaps = courseCodes.map((code) => Courses.findOne({ courseCode: code }));
        const courses = await Promise.all(coursesMaps);

        return courses.filter((course) => course !== null);
    } catch (error) {
        logError(error);
        return null
    }
}

const getStudentProfileInfo = (studentData) => {
    return studentData
};

const getStudentSchedules = async (studentData) => {
    try {
        const doc = await Classes.findOne({ classId: studentData.classId });
        if (!doc) return null;

        return doc.schedule;
    } catch (error) {
        logError(error);
        return null;
    }
}

const getStudentSubmissions = async (studentData) => {
    try {
        const studentsCourseCodes = studentData.courses;
        const courseSubmissions = studentsCourseCodes.map(c => Submissions.findOne({ courseCode: c }));
        const submissionsArray = await Promise.all(courseSubmissions);
        const filteredSubmissions = submissionsArray.filter((c) => c !== null);
        const timeNow = new Date().getTime();

        filteredSubmissions.forEach(sub => {
            for (let i = 0; i < sub.lecturerSubmission.length; i++) {
                if (sub.lecturerSubmission[i].startDate.timeStamp > timeNow) {
                    console.log('starts later on', new Date(Number(sub.lecturerSubmission[i].startDate.timeStamp)).toLocaleDateString())
                    sub.lecturerSubmission.splice(i, 1);
                } else {
                    continue;
                }
            }
        });
        return filteredSubmissions
    } catch (error) {
        logError(error);
        return null;
    }
}

const getCourseRegistrationPage = async (studentData) => {
    console.log(studentData)
    try {
        const data = await RegisteredCourses.findOne({ registrationCode: studentData.registeredCourses });
        if (!data) return [];

        const coursesMap = data.courses.map((courseCode) => Courses.findOne({ courseCode: courseCode }));
        const courses = await Promise.all(coursesMap);

        return courses.filter((c) => c !== null);
    }
    catch (error) {
        logError(error);
        return null;
    }
}

const getStudentNotifications = async (studentData) => {

    try {
        return []
    } catch (error) {
        logError(error);
        return null
    }

}
const getStudentAnnouncements = async (studentData) => {

    try {
        const data = await Announcement.find({ to: { $in: ['all', 'students'] } })
        return !data ? [] : data;
    } catch (error) {
        logError(error);
        return null
    }
}

const getStudentsAvailableQuizzes = async (studentData) => {
    try {
        const courseCodes = studentData.courses;
        if (!courseCodes || courseCodes.length === 0) {
            return []
        }

        let quizzes = [];
        const currentDate = new Date();

        for (let code of courseCodes) {
            const docs = await Quiz.find({
                courseCode: code,
                // startDate: { $lte: currentDate },
                // endDate: { $gte: currentDate }
            });

            if (!docs || docs.length === 0) {
                continue;
            }

            const courseInfo = await Courses.findOne({ courseCode: code }, { title: 1, lecturer: 1, courseCode: 1, _id: 0 });

            quizzes.push({ info: courseInfo, docs: [...docs] });
        }
        return quizzes;
    } catch (error) {
        logError(error);
        return null;
    }
}

const getQuizOnboard = async (studentData, id) => {
    try {
        if (!id) return [];

        const docs = await Quiz.findOne({ _id: id });
        if (!docs) return [];

        return docs;
    } catch (error) {
        logError(error);
        return null;
    }
}

const returnUrlsToMethod = (pageurl = "") => {
    if (!pageurl) return undefined;

    const urlToMethodsObject = {
        "dashboards": getStudentDashboard,
        "courses": getStudentCourses,
        "schedules": getStudentSchedules,
        "submissions": getStudentSubmissions,
        "profile": getStudentProfileInfo,
        "register-courses": getCourseRegistrationPage,
        "notifications": getStudentNotifications,
        "announcements": getStudentAnnouncements,
        "quizzes": getStudentsAvailableQuizzes,
        "quiz-onboard": getQuizOnboard,
    }
    return urlToMethodsObject[pageurl] || undefined;
}


export const renderStudentViews = async (req, res) => {
    const { pageUrl } = req.params;
    const { studentData } = req;


    const urlToMethod = returnUrlsToMethod(pageUrl);
    if (!urlToMethod)
        return res.status(404).render('global/error', { error: "The requested resource is unavailable", status: 404 });

    const dataObject = pageUrl === 'quiz-onboard' ? await urlToMethod(studentData, req.query.id ? req.query.id : null) : await urlToMethod(studentData);
    if (!dataObject)
        return res.status(404).render('global/error', { error: "The requested student page objectData is unavailable", status: 404 });

    try {
        return res.render('student/student-main', {
            student: studentData,
            data: dataObject,
            pageTitle: pageUrl,
            stylesheets: [`/css/student/${pageUrl}`],
            pageUrl: `layouts/${pageUrl}`,
            currentPage: 'dashboard',
            userType: 'Student',
            scripts: [`/script/scripts/student/${pageUrl}`]
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderCourseView = async (req, res) => {
    const { studentData } = req;
    const { courseId } = req.params;

    if (!courseId || !isValidObjectId(courseId)) return res.status(400);

    try {
        const course = await Courses.findOne({ _id: courseId });
        if (!course) return res.status(404);

        return res.render('student/student-main', {
            student: studentData,
            course: course,
            pageTitle: course.title,
            stylesheets: [`/css/student/course`],
            pageUrl: `layouts/course`,
            currentPage: 'course',
            userType: 'Student',
            scripts: [`/script/scripts/student/course`]
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}