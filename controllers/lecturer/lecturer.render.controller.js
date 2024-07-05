import { CoursesDB } from '../../utils/global/db.utils';
import { logError } from '../admin/admin.utils';

const Courses = CoursesDB();

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

export const renderClassrooms = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Classrooms",
            stylesheets: [],
            pageUrl: 'layouts/classrooms',
            currentPage: 'classrooms',
            userType: 'Lecturer',
            scripts: []
        });
    } catch (error) {
        logError(error);
        return res.status(500);
    }
}

export const renderClassroom = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Classroom",
            stylesheets: [],
            pageUrl: 'layouts/classrooms.view.ejs',
            currentPage: 'classrooms',
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

export const renderLive = (req, res) => {
    const { lecturerData } = req;

    try {
        return res.render('lecturer/lecturer-main', {
            lecturer: lecturerData,
            pageTitle: "Live",
            stylesheets: [],
            pageUrl: 'layouts/live',
            currentPage: 'live',
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