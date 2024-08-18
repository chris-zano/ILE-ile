import { AnnouncementsDB, ClassesDB, CoursesDB, LecturersDB, StudentsDB } from '../../utils/global/db.utils.js';
import * as utils from './admin.utils.js';

const Courses = CoursesDB();
const Classes = ClassesDB();
const Students = StudentsDB();
const Tutors = LecturersDB();
const Announcement = AnnouncementsDB();

export const renderImports = async (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Imports",
        stylesheets: ["/css/admin/import"],
        pageUrl: 'layouts/imports',
        currentPage: '',
        userType: userType,
        scripts: [`/script/scripts/admin/import-${userType}`]
    });
}

export const renderDashboard = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Dashboard",
        stylesheets: ["/css/admin/dashboard"],
        pageUrl: 'layouts/dashboard',
        currentPage: 'dashboard',
        userType: userType,
        scripts: ["/script/scripts/admin/dashboard"]
    });
}

export const renderStudents = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Students",
        stylesheets: ["/css/admin/students"],
        pageUrl: 'layouts/students',
        currentPage: 'students',
        userType: userType,
        scripts: ["/script/scripts/admin/students"]
    });
}

export const renderTutors = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutors",
        stylesheets: ["/css/admin/tutors"],
        pageUrl: 'layouts/tutors',
        currentPage: 'tutors',
        userType: userType,
        scripts: ["/script/scripts/admin/tutors"]
    });
}

export const renderCourses = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Courses",
        stylesheets: ["/css/admin/courses"],
        pageUrl: 'layouts/courses',
        userType: userType,
        currentPage: 'courses',
        scripts: ["/script/scripts/admin/courses"],
    });
}

export const renderClassrooms = async (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    try {
        const classes = await Classes.find();
        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Classes",
            stylesheets: ["/css/admin/classes", "/css/admin/classes.schedules"],
            pageUrl: 'layouts/classes',
            currentPage: 'classrooms',
            userType: userType,
            scripts: ["/script/scripts/admin/classes"],
            classes: classes
        });
    } catch (error) {
        utils.logError(error);
        return res.render('global/error', { error: "An Error occured", status: 500 });
    }
}

export const renderAnnouncements = async (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    
    try {
        const data = await Announcement.find();
        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Announcements",
            stylesheets: ["/css/admin/announcements"],
            pageUrl: 'layouts/announcements',
            currentPage: 'announcements',
            userType: userType,
            scripts: ["/script/scripts/admin/announcements"],
            data: data
        });
    } catch (error) {
        utils.logError(error);
        return res.render('global/error', { error: "An Error occured", status: 500 });
    }
}



export const renderUpdateCourse = async (req, res) => {
    const { courseCode, id } = req.params;
    const { adminData } = req;

    if (courseCode == "null") {
        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Update-Course",
            stylesheets: ["/css/admin/update.course"],
            pageUrl: 'layouts/update.course.ejs',
            currentPage: 'course',
            userType: "Admin",
            scripts: ["/script/scripts/admin/update.course"],
            course: "null"
        });
    }

    try {
        const course = await Courses.findOne({ _id: courseCode });
        if (!course) return res.render("global/error", { error: "An Error occured", status: 404 });

        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Update-Course",
            stylesheets: ["/css/admin/update.course"],
            pageUrl: 'layouts/update.course.ejs',
            currentPage: 'course',
            userType: "Admin",
            scripts: ["/script/scripts/admin/update.course"],
            course: course
        });
    } catch (error) {
        utils.logError(error);
        return res.render("global/error", { error: "An Error occured", status: 404 });
    }
}

const getCoursesBySemester = async (semester = 1) => {
    try {
        const courses = await Courses.aggregate([
            {
                $match: {
                    semester: semester
                }
            },
            {
                $group: {
                    _id: '$level',
                    courses: { $push: '$$ROOT' },
                }
            },
            {
                $sort: {
                    _id: -1
                }
            }
        ]);

        return courses;
    } catch (error) {
        utils.logError(error);
        return null;
    }
}

export const renderOrganiseCourses = async (req, res) => {
    const { adminData } = req;

    try {
        const courses = await getCoursesBySemester();
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: `Organize Courses`,
            stylesheets: ["/css/admin/organize.courses"],
            pageUrl: 'layouts/view.organize-courses.ejs',
            currentPage: 'Courses',
            userType: "Admin",
            scripts: ["/script/scripts/admin/view.organize-courses"],
            courseGroups: JSON.stringify(courses)
        });
    } catch (error) {
        utils.logError(error);

    }
}

export const renderViewAdminProfile = (req, res) => {
    const { adminData } = req;

    // res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: `Profile ~ ${adminData.firstname}`,
        stylesheets: ["/css/admin/view.profile"],
        pageUrl: 'layouts/view.admin-profile.ejs',
        currentPage: '',
        userType: "Admin",
        scripts: ["/script/scripts/admin/view.profile"]
    });
}

export const renderViewStudent = async (req, res) => {
    const { userType, studentId } = req.params;
    const { adminData } = req;

    if (userType === 'student') {
        console.log("student")
    }
    try {
        const student = await Students.findOne({_id: studentId});

        if (!student) return res.status(404);
        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Student-Profile",
            stylesheets: ["/css/admin/import"],
            pageUrl: 'layouts/view.student.ejs',
            currentPage: 'students',
            userType: userType,
            scripts: ["/script/scripts/admin/view.student"],
            student: student
        });

    } catch (error) {
        utils.logError(error);
        return res.status(500);
    }

}

export const renderViewTutor = async (req, res) => {
    const { userType, tutorId } = req.params;
    const { adminData } = req;

    console.log({ userType, tutorId })
    try {
        const tutor = await Tutors.findOne({_id: tutorId});
        if (!tutor) return res.status(404);

        res.set('Cache-Control', 'public, max-age=30');
        return res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Tutor-Profile",
            stylesheets: ["/css/admin/import"],
            pageUrl: 'layouts/view.tutor.ejs',
            currentPage: 'tutor',
            userType: userType,
            scripts: ["/script/scripts/admin/view.tutor"],
            tutor: tutor
        });
    } catch (error) {
        utils.logError(error);
        return res.status(500);
    }
}

export const renderViewCourse = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    return res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Course-Profile",
        stylesheets: ["/css/admin/view.courses"],
        pageUrl: 'layouts/view.courses.ejs',
        currentPage: 'course',
        userType: userType,
        scripts: ["/script/scripts/admin/view.courses"]
    });
}