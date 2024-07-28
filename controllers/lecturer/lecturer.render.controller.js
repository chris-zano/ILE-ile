import { isValidObjectId } from 'mongoose';
import { ClassesDB, CoursesDB, RegisteredCoursesDB, StudentsDB } from '../../utils/global/db.utils.js';
import { logError } from '../admin/admin.utils.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const Students = StudentsDB()
const RegisteredCourses = RegisteredCoursesDB();

const getDashboards = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const getSchedules = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const getSubmissions = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const getAnnouncements = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const getNotifications = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const getCourses = async (lecturerData) => {
    try {
        const courses = await Courses.find({
            $and: [
                { 'lecturer.lecturerId': lecturerData.lecturerId },
                { 'lecturer.name': `${lecturerData.firstname} ${lecturerData.lastname}` }
            ]
        });
        return courses;
    } catch (error) {
        logError(error);
        return null;
    }
}

const getProfile = async (lecturerData) => {
    try {
        return [];
    } catch (error) {
        logError(error);
        return null;
    }
}
const returnUrlsToMethod = (pageurl = "") => {
    if (!pageurl) return undefined;

    const urlToMethodsObject = {
        "dashboards": getDashboards,
        "schedules": getSchedules,
        "submissions": getSubmissions,
        "announcements": getAnnouncements,
        "notifications": getNotifications,
        "courses": getCourses,
        "profile": getProfile,
    }
    return urlToMethodsObject[pageurl] || undefined;
}

export const renderLecturerViews = async (req, res) => {
    const { lecturerData } = req;
    const { pageUrl } = req.params;

    if (!pageUrl || !lecturerData) return res.status(400).render('global/error', { status: 400, error: "request is invalid" });

    const urlToMethod = returnUrlsToMethod(pageUrl);
    if (!urlToMethod) return res.status(404).render('global/error', { error: "The requested resource is unavailable", status: 404 });

    const dataObject = await urlToMethod(lecturerData);
    if (!dataObject) return res.status(404).render('global/error', { error: "The requested student page objectData is unavailable", status: 404 });

    try {
        res.set("Cache-Control", "public, max-age=60");
        res.status(200);

        return res.render('lecturer/lecturer-main',
            {
                lecturer: lecturerData,
                pageTitle: pageUrl,
                stylesheets: [`/css/lecturer/${pageUrl}`],
                pageUrl: `layouts/${pageUrl}`,
                currentPage: `${pageUrl}`,
                userType: 'Lecturer',
                scripts: [`/script/scripts/lecturer/${pageUrl}`],
                data: dataObject
            }
        )
    } catch (error) {

    }
}

export const renderDashboard = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Dashboard",
            stylesheets: [],
            pageUrl: 'layouts/dashboard',
            currentPage: 'dashboard',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderSchedules = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Schedules",
            stylesheets: [],
            pageUrl: 'layouts/schedules',
            currentPage: 'schedules',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderCourses = async (req, res) => {
    const { lecturerData } = req;

    try {
        const courses = await Courses.find({
            $and: [
                { 'lecturer.lecturerId': lecturerData.lecturerId },
                { 'lecturer.name': `${lecturerData.firstname} ${lecturerData.lastname}` }
            ]
        });

        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Courses",
            stylesheets: ['/css/lecturer/courses'],
            pageUrl: 'layouts/courses',
            currentPage: 'courses',
            userType: 'Lecturer',
            scripts: [],
            courses: courses || []
        });
    }
    catch (error) {
        logError(error);
        return res.status(500);
    }

}

export const renderSubmissions = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Submissions",
            stylesheets: [],
            pageUrl: 'layouts/submissions',
            currentPage: 'submissions',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderNotifications = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Notifications",
            stylesheets: [],
            pageUrl: 'layouts/notifications',
            currentPage: 'notifications',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderCourse = async (req, res) => {
    const { lecturerData } = req;
    const { courseId } = req.params;

    try {
        const course = await Courses.findOne({ _id: courseId });
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Course",
            stylesheets: ['/css/lecturer/course.view'],
            pageUrl: 'layouts/course.view.ejs',
            currentPage: 'course',
            userType: 'Lecturer',
            course: course || [],
            scripts: ['/script/scripts/lecturer/course.view']
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderAnnouncements = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Announcements",
            stylesheets: ['/css/lecturer/announcement'],
            pageUrl: 'layouts/announcements',
            currentPage: 'announcements',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderViewLecturerProfile = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: `Profile ~ ${lecturerData.firstname}`,
            stylesheets: ["/css/lecturer/view.profile"],
            pageUrl: 'layouts/view.lecturer-profile.ejs',
            currentPage: '',
            userType: "lecturer",
            scripts: ["/script/scripts/lecturer/view.profile"]
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}