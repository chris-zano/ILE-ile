const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');
const utils = require('../../controllers/admin/admin.utils');

module.exports.verifyAdmin = (req, res, next) => {
    AdminsDB().findById(req.params.id)
        .then((admin) => {
            if (admin == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { error: "Unauthorised access", status: 403 });
                return
            }
            else {
                req.adminData = {
                    id: admin._id,
                    adminId: admin.adminId,
                    role: admin.role,
                    firstname: admin.firstName,
                    lastname: admin.lastName,
                    faculty: admin.faculty,
                    profilePicUrl: admin.profilePicUrl
                }
                next();
            }
        }).catch((error) => {
            
            utils.logError(error);
            res.render("index", {flush: "true"})
            return;
        });
}

module.exports.verifyLecturer = (req, res, next) => {
    LecturersDB().findById(req.params.id)
        .then((lecturer) => {
            if (lecturer == null) {
                utils.logError(new ReferenceError());
                res.render('global/error', { error: "Unauthorised access", status: 403 });
                return
            }
            else {
                req.lecturerData = {
                    id: lecturer._id,
                    lecturerId: lecturer.lecturerId,
                    firstname: lecturer.firstName,
                    lastname: lecturer.lastName,
                    faculty: lecturer.faculty,
                    profilePicUrl: lecturer.profilePicUrl
                }
                next();
            }
        }).catch((error) => {
            
            utils.logError(error);
            return {
                message: "An error occured",
                admin: {},
                status: 500
            }
        });
}

module.exports.authenticateLoginSequence = (req, res, next) => {
    const { username, password } = req.body;
    const user = String(username)

    const adminRegexp = /^AD-\d{3}[A-Za-z0-9]*$/;
    const tutorRegexp = /^TU-\d{3}[A-Za-z0-9]*$/;
    const studentRegexp = /^\d{10}$/;


    if (adminRegexp.test(user)) req.usernameformat = "admin";
    else if (tutorRegexp.test(user)) req.usernameformat = "tutor";
    else if (studentRegexp.test(user)) req.usernameformat = "student";
    else req.usernameformat = "none";


    if (req.usernameformat == "none") {
        res.status(403).json({ message: "Unauthorised login" })
        return;
    }

    next();
}