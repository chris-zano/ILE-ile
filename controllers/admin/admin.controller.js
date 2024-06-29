
const { AdminsDB, StudentsDB, LecturersDB } = require('../../utils/global/db.utils');
const { logSession, logError } = require('./admin.utils');

const Students = StudentsDB();
const Admins = AdminsDB();
const Lecturers = LecturersDB();

const tutorLogin = async (username, password, ip, res) => {
    try {
        const lecturer = await Lecturers.findOne({ lecturerId: username, password: password });

        if (!lecturer) return logSession(username, ip, "failed"),
            res.status(404).json({ message: "Incorrect username or password", user: {} });

        const user = {
            id: lecturer._id,
            lecturerId: lecturer.lecturerId,
            firstname: lecturer.firstName,
            lastname: lecturer.lastName,
            faculty: lecturer.faculty,
            courses: lecturer.assignedCourses,
            profilePicUrl: lecturer.profilePicUrl,
            v: lecturer.__v
        }

        return logSession(username, ip, "success"),
            res.status(200).json({ message: "success", userType: "lecturer", user });
    } catch (error) {
        return logError(error),
            logSession(username, ip, "failed"),
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
    }
}

const adminLogin = async (username, password, ip, res) => {
    try {
        const admin = await Admins.findOne({ adminId: username, password: password });

        if (!admin) return logSession(username, ip, "failed"),
            res.status(404).json({ message: "Incorrect username or password", user: {} });

        const user = {
            id: admin._id,
            adminId: admin.adminId,
            role: admin.role,
            firstname: admin.firstName,
            lastname: admin.lastName,
            faculty: admin.faculty,
            profilePicUrl: admin.profilePicUrl,
            v: admin.__v
        }

        return logSession(username, ip, "success"),
            res.status(200).json({ message: "success", userType: "admin", user });
    } catch (error) {
        return logError(error),
            logSession(username, ip, "failed"),
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
    }
}
const studentLogin = async (username, password, ip, res) => {
    try {
        const matchedDocument = await Students.findOne({ studentId: username, password: password });

        if (!matchedDocument) return logSession(username, ip, "failed"),
            res.status(404).json({ message: "User not found", user: {} });

        const user = {
            id: matchedDocument._id,
            studentId: matchedDocument.studentId,
            firstName: matchedDocument.firstName,
            lastName: matchedDocument.lastName,
            program: matchedDocument.program,
            level: matchedDocument.level,
            session: matchedDocument.session,
            faculty: matchedDocument.faculty,
            courses: matchedDocument.courses,
            registeredCourses: matchedDocument.registeredCourses,
            files: matchedDocument.files,
            repos: matchedDocument.repos,
            classId: matchedDocument.classId,
            profilePicUrl: matchedDocument.profilePicUrl,
            v: matchedDocument.__v
        }
        return logSession(username, ip, "success"),
            res.status(200).json({ message: "Success", userType: "student", user });
    } catch (error) {
        return logError(error),
            logSession(username, ip, "failed"),
            res.status(500).render('global/error', { error: "Internal Server Error", status: 500 });
    }

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
        res.render("index", { flush: "false" })
    }
}