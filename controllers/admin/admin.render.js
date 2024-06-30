const { AdminsDB, ClassesDB, CoursesDB } = require('../../utils/global/db.utils');
const utils = require('./admin.utils');

const Courses = CoursesDB();

module.exports.renderImports = async (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Imports",
        stylesheets: ["/css/admin/import"],
        pageUrl: 'layouts/imports',
        currentPage: '',
        userType: userType,
        scripts: [`/script/scripts/admin/import-${userType}`]
    });

    return;
}

module.exports.renderDashboard = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Dashboard",
        stylesheets: ["/css/admin/dashboard"],
        pageUrl: 'layouts/dashboard',
        currentPage: 'dashboard',
        userType: userType,
        scripts: ["/script/scripts/admin/dashboard"]
    });

    return;
}

module.exports.renderStudents = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Students",
        stylesheets: ["/css/admin/students"],
        pageUrl: 'layouts/students',
        currentPage: 'students',
        userType: userType,
        scripts: ["/script/scripts/admin/students"]
    });

    return;

}

module.exports.renderTutors = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutors",
        stylesheets: ["/css/admin/tutors"],
        pageUrl: 'layouts/tutors',
        currentPage: 'tutors',
        userType: userType,
        scripts: ["/script/scripts/admin/tutors"]
    });

    return;
}

module.exports.renderCourses = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Courses",
        stylesheets: ["/css/admin/courses"],
        pageUrl: 'layouts/courses',
        userType: userType,
        currentPage: 'courses',
        scripts: ["/script/scripts/admin/courses"],
    });
    return;
}

module.exports.renderClassrooms = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    ClassesDB().find()
        .then((classes) => {
            res.set('Cache-Control', 'public, max-age=30');
            res.render('admin/admin-main', {
                admin: adminData,
                pageTitle: "Classes",
                stylesheets: ["/css/admin/classes", "/css/admin/classes.schedules"],
                pageUrl: 'layouts/classes',
                currentPage: 'classrooms',
                userType: userType,
                scripts: ["/script/scripts/admin/classes"],
                classes: classes
            });
        }).catch((error) => {
            utils.logError(error);
        })
}

module.exports.renderUpdateStudent = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Student",
        stylesheets: ["/css/admin/update.student"],
        pageUrl: 'layouts/update.student.ejs',
        currentPage: 'students',
        userType: userType,
        scripts: ["/script/scripts/admin/update.student"]
    });

    return;
}

module.exports.renderUpdateTutor = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Tutor",
        stylesheets: ["/css/admin/update.tutor"],
        pageUrl: 'layouts/update.tutor..ejs',
        currentPage: 'tutor',
        userType: userType,
        scripts: ["/script/scripts/admin/update.tutor"]
    });

    return;
}

module.exports.renderUpdateCourse = (req, res) => {
    const { courseCode, id } = req.params;
    const { adminData } = req;

    if (courseCode == "null") {
        res.set('Cache-Control', 'public, max-age=30');
        res.render('admin/admin-main', {
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
    else {
        CoursesDB().findOne({ _id: courseCode })
            .then((course) => {
                res.set('Cache-Control', 'public, max-age=30');
                res.render('admin/admin-main', {
                    admin: adminData,
                    pageTitle: "Update-Course",
                    stylesheets: ["/css/admin/update.course"],
                    pageUrl: 'layouts/update.course.ejs',
                    currentPage: 'course',
                    userType: "Admin",
                    scripts: ["/script/scripts/admin/update.course"],
                    course: course
                });
            }).catch((error) => {
                utils.logError(error);
            });

    }

    return;
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
    }catch(error) {
        utils.logError(error);
        return null;
    }
}

module.exports.renderOrganiseCourses = async (req, res) => {
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
            courseGroups: courses
        });
    } catch (error) {
        utils.logError(error);

    }
}

module.exports.renderViewAdminProfile = (req, res) => {
    const { adminData } = req;

    // res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: `Profile ~ ${adminData.firstname}`,
        stylesheets: ["/css/admin/view.profile"],
        pageUrl: 'layouts/view.admin-profile.ejs',
        currentPage: '',
        userType: "Admin",
        scripts: ["/script/scripts/admin/view.profile"]
    });

    return;
}

module.exports.renderViewStudent = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Student-Profile",
        stylesheets: ["/css/admin/view.student"],
        pageUrl: 'layouts/view.student.ejs',
        currentPage: 'students',
        userType: userType,
        scripts: ["/script/scripts/admin/view.student"]
    });

    return;
}

module.exports.renderViewTutor = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutor-Profile",
        stylesheets: ["/css/admin/view.tutor"],
        pageUrl: 'layouts/view.tutor.ejs',
        currentPage: 'tutor',
        userType: userType,
        scripts: ["/script/scripts/admin/view.tutor"]
    });

    return;
}

module.exports.renderViewCourse = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.set('Cache-Control', 'public, max-age=30');
    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Course-Profile",
        stylesheets: ["/css/admin/view.courses"],
        pageUrl: 'layouts/view.courses.ejs',
        currentPage: 'course',
        userType: userType,
        scripts: ["/script/scripts/admin/view.courses"]
    });

    return;
}