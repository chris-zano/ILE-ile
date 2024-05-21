
const { AdminsDB, StudentsDB, LecturersDB } = require('../../utils/global/db.utils');
const { logSession, logError } = require('./admin.utils');

const tutorLogin = (username, password, ip, res) => {
    LecturersDB().findOne({ lecturerId: username, password: password })
        .then((tutor) => {
            if (!tutor) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            } else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success",userType:"lecturer", user: {
                        id: tutor._id,
                        lecturerId: tutor.lecturerId,
                        firstname: tutor.firstName,
                        lastname: tutor.lastName,
                        faculty: tutor.faculty,
                        courses: tutor.assignedCourses,
                        v: tutor.__v
                    }
                });
            }
            return;
        }).catch((error) => {
            logError(error);
            console.log(error);
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
        });
}

const adminLogin = (username, password, ip, res) => {
    AdminsDB().findOne({ adminId: username, password: password })
        .then((admin) => {
            if (!admin) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            }
            else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success",userType: "admin", user: {
                        id: admin._id,
                        adminId: admin.adminId,
                        firstname: admin.firstName,
                        lastname: admin.lastName,
                        faculty: admin.faculty,
                        v: admin.__v
                    }
                });
            }
        }).catch((error) => {
            logError(error);
            console.log(error);
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
        });
}
const studentLogin = (username, password, ip, res) => {
    StudentsDB().findOne({ studentId: username, password: password })
        .then((student) => {
            if (!student) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            } else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success",userType: "student", user: {
                        id: student._id,
                        studentId: student.studentId,
                        firstname: student.firstName,
                        lastname: student.lastName,
                        faculty: student.faculty,
                        program: student.program,
                        level: student.level,
                        courses: student.courses,
                        files: student.files,
                        repos: student.repos,
                        v: student.__v
                    }
                }); 
            }
        }).catch((error) => {
            logError(error);
            console.log(error);
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
        });
}


module.exports.loginUser = (req, res) => {
    const { usernameformat } = req;
    const { username, password } = req.body;
    const userFormats = {
        tutor: tutorLogin,
        admin: adminLogin,
        student: studentLogin
    }

    const formatMatchMetod = userFormats[usernameformat];

    if (formatMatchMetod) {
        formatMatchMetod(username, password, req.ip, res);
    }
    else {
        //handle if unrecogneised username format
        console.log("Unmatched format")
    }
}