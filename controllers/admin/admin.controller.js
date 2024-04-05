const Tutors = require('../../models/lecturer/lecturer.model');
const Admins = require('../../models/admin/admin.models');
const Students = require('../../models/student/student.model');

const { logSession, logError } = require('./admin.utils');

const tutorLogin = (username, password, ip) => {
    Tutors.findOne({ lecturerId: username, password: password })
        .then((tutor) => {
            if (!tutor) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            } else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success", user: {
                        id: tutor.lecturerId,
                        firstname: tutor.firstName,
                        lastname: tutor.lastName,
                        faculty: tutor.faculty,
                        courses: tutor.assignedCourses,

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

const adminLogin = (username, password, ip) => {
    Admins.findOne({ adminId: username, password: password })
        .then((admin) => {
            if (!admin) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            }
            else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success", user: {
                        id: admin.adminId,
                        firstname: admin.firstName,
                        lastname: admin.lastName,
                        faculty: admin.faculty,
                    }
                });
            }
        }).catch((error) => {
            logError(error);
            console.log(error);
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
        });
}
const studentLogin = (username, password, ip) => {
    Students.findOne({ studentId: username, password: password })
        .then((student) => {
            if (!student) {
                logSession(username, ip, "failed");
                res.status(404).json({ message: "Incorrect username or password", user: {} });
            } else {
                logSession(username, ip, "success");
                res.status(200).json({
                    message: "success", user: {
                        id: student.studentId,
                        firstname: student.firstName,
                        lastname: student.lastName,
                        faculty: student.faculty,
                        program: student.program,
                        level: student.level,
                        courses: student.courses,
                        files: student.files,
                        repos: student.repos
                    }
                }); 
            }
        }).catch((error) => {
            logError(error);
            console.log(error);
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
        });
}

exports.loginUser = (req, res) => {
    const { usernameformat } = req;
    const { username, password } = req.body;
    const userFormats = {
        tutor: tutorLogin,
        admin: adminLogin,
        student: studentLogin
    }

    const formatMatchMetod = userFormats[usernameformat];

    if (formatMatchMetod) {
        formatMatchMetod(username, password);
    }
    else {
        //handle if unrecogneised username format
        console.log("Unmatched format")
    }
}