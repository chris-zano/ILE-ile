const { AdminsDB, ClassesDB, CoursesDB } = require('../../utils/global/db.utils');
const utils = require('./admin.utils');


exports.renderImports = async (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Imports",
        stylesheets: ["/css/admin/import"],
        pageUrl: 'layouts/imports',
        userType: userType,
        scripts: [`/script/scripts/admin/import-${userType}`]
    });

    return;
}

exports.renderDashboard = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Dashboard",
        stylesheets: ["/css/admin/dashboard"],
        pageUrl: 'layouts/dashboard',
        userType: userType,
        scripts: ["/script/scripts/admin/dashboard"]
    });

    return;
}

exports.renderStudents = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Students",
        stylesheets: ["/css/admin/students"],
        pageUrl: 'layouts/students',
        userType: userType,
        scripts: ["/script/scripts/admin/students"]
    });

    return;

}

exports.renderTutors = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutors",
        stylesheets: ["/css/admin/tutors"],
        pageUrl: 'layouts/tutors',
        userType: userType,
        scripts: ["/script/scripts/admin/tutors"]
    });

    return;
}

exports.renderCourses = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    CoursesDB.find({})
        .limit(300)
        .exec()
        .then((courses) => {
            console.log(courses);
            res.render('admin/admin-main', {
                admin: adminData,
                pageTitle: "Courses",
                stylesheets: ["/css/admin/courses"],
                pageUrl: 'layouts/courses',
                userType: userType,
                scripts: ["/script/scripts/admin/courses"],
                courses: courses
            });
        }).catch((error) => {
            utils.logError(error);
            console.log(error)
        })
    return;
}

exports.renderClassrooms = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    ClassesDB.find()
    .then((classes) => {
        res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Classes",
            stylesheets: ["/css/admin/classes"],
            pageUrl: 'layouts/classes',
            userType: userType,
            scripts: ["/script/scripts/admin/classes"],
            classes: classes
        });
    }).catch((error) => {
        utils.logError(error);
        console.log(error)
    })
}

exports.renderUpdateStudent = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Student",
        stylesheets: ["/css/admin/update.student"],
        pageUrl: 'layouts/update.student.ejs',
        userType: userType,
        scripts: ["/script/scripts/admin/update.student"]
    });

    return;
}

exports.renderUpdateTutor = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Update-Tutor",
        stylesheets: ["/css/admin/update.tutor"],
        pageUrl: 'layouts/update.tutor..ejs',
        userType: userType,
        scripts: ["/script/scripts/admin/update.tutor"]
    });

    return;
}

exports.renderUpdateCourse = (req, res) => {
    const { courseCode, id } = req.params;
    const { adminData } = req;

    console.log(courseCode)
    if(courseCode == "null") {
        res.render('admin/admin-main', {
            admin: adminData,
            pageTitle: "Update-Course",
            stylesheets: ["/css/admin/update.course"],
            pageUrl: 'layouts/update.course.ejs',
            userType: "Admin",
            scripts: ["/script/scripts/admin/update.course"],
            course: "null"
        });
    }
    else {
        CoursesDB.findOne({ _id: courseCode })
        .then((course) => {
            console.log(course);
            res.render('admin/admin-main', {
                admin: adminData,
                pageTitle: "Update-Course",
                stylesheets: ["/css/admin/update.course"],
                pageUrl: 'layouts/update.course.ejs',
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

exports.renderViewStudent = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Student-Profile",
        stylesheets: ["/css/admin/view.student"],
        pageUrl: 'layouts/view.student.ejs',
        userType: userType,
        scripts: ["/script/scripts/admin/view.student"]
    });

    return;
}

exports.renderViewTutor = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Tutor-Profile",
        stylesheets: ["/css/admin/view.tutor"],
        pageUrl: 'layouts/view.tutor.ejs',
        userType: userType,
        scripts: ["/script/scripts/admin/view.tutor"]
    });

    return;
}

exports.renderViewCourse = (req, res) => {
    const { userType, id } = req.params;
    const { adminData } = req;

    res.render('admin/admin-main', {
        admin: adminData,
        pageTitle: "Course-Profile",
        stylesheets: ["/css/admin/view.courses"],
        pageUrl: 'layouts/view.courses.ejs',
        userType: userType,
        scripts: ["/script/scripts/admin/view.courses"]
    });

    return;
}