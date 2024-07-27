import { isValidObjectId } from 'mongoose';
import { ClassesDB, CoursesDB, RegisteredCoursesDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const RegisteredCourses = RegisteredCoursesDB();

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

const getStudentClassroom = async (studentData) => {
    try {
        const doc = await Classes.findOne({ classId: studentData.classId })
        return doc || null;
    } catch (error) {
        logError(error);
        return null;
    }
}

const getCourseRegistrationPage = async (studentData) => {
    try {
        console.log(studentData)
        const data = await RegisteredCourses.findOne({ registrationCode: studentData.registeredCourses });
        const coursesMap = data.courses.map((courseCode) => Courses.findOne({ courseCode: courseCode }));
        const courses = await Promise.all(coursesMap);
        console.log("registered courses are : ", courses);
        return courses;
    }
    catch (error) {
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
        "classroom": getStudentClassroom,
        "profile": getStudentProfileInfo,
        "register-courses": getCourseRegistrationPage
    }
    return urlToMethodsObject[pageurl] || undefined;
}


export const renderStudentViews = async (req, res) => {
    const { pageUrl } = req.params;
    const { studentData } = req;

    const urlToMethod = returnUrlsToMethod(pageUrl);
    if (!urlToMethod)
        return res.status(404).render('global/error', { error: "The requested resource is unavailable", status: 404 });

    const dataObject = await urlToMethod(studentData);
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
        const course = await Courses.findOne({_id: courseId});
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
    }catch(error) {
        logError(error);
        return res.status(500);
    }
}