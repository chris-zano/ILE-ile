const path = require('path');
const fs = require('fs');
//user models import

const { getCourses, logError, getSystemDate } = require("./admin.utils");
const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');
const Files = require('../../models/courses/files.models');

const dashboardData = {
    pageTitle: 'Admin Dashboard',
    stylesheets: ['/css/admin/dashboard', '/css/admin/users', '/css/admin/courses', '/css/admin/reports', '/css/admin/settings', '/css/admin/import', '/css/admin/main'],
    utilityScripts: ['/script/utils/admin/util.restful'],
    headerUrl: 'global/header-admin',
    bodyUrl: 'admin/main'
};

const getStudentsDataByOffset = async (offset, key, value) => {
    let end = false;
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    return StudentsDB.find(query)
        .skip(offset)
        .limit(256)
        .exec()
        .then((docs) => {
            if (docs.length < 256) {
                end = true;
            }
            return {
                status: 200,
                message: 'success',
                docs: docs,
                cursor: Number(offset) + 256,
                end: end
            }
        })
        .catch((error) => {
            return {
                status: 500,
                message: 'An error occured while fetching',
                docs: [],
                cursor: 0,
                end: end
            }
        }
        )
}

const getLecturersDataByOffset = (offset, key, value) => {
    let end = false;
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    return LecturersDB.find(query)
        .skip(offset)
        .limit(256)
        .exec()
        .then((docs) => {
            if (docs.length < 256) {
                end = true;
            }
            return {
                status: 200,
                message: 'success',
                docs: docs,
                cursor: Number(offset) + 256,
                end: end
            }
        })
        .catch((error) => {
            return {
                status: 500,
                message: 'An error occured while fetching',
                docs: [],
                cursor: 0,
                end: end
            }
        }
        )
}

exports.createLecturer = async (req, res) => {
    try {
        const createdAt = getSystemDate();
        const { lecturerId, firstName, lastName, faculty } = req.body;

        const tutor = new LecturersDB({
            lecturerId: lecturerId,
            firstName: firstName,
            lastName: lastName,
            faculty: faculty,
            "created-at": createdAt
        });

        await tutor.save();

        res.status(200).redirect(`/admins/render/imports/lecturers/${req.adminData.id}`);
    } catch (error) {
        if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(400).render("global/error", { error: `Lecturer with ID ${error.keyValue.lecturerId} already exists`, status: 400 });
        } else {
            logError(error);
            res.status(500).render("global/error", { error: "Failed to create new Lecturer", status: 500 });
        }
    }
};


//handlers
exports.createStudent = (req, res) => {
    try {
        const { studentId, firstName, lastName, program, year, level, faculty } = req.body;
        const student = new StudentsDB({ studentId, firstName, lastName, program, year, level, faculty, courses: [], files: [], repos: [] });
        student.save();

        res.status(200).redirect(`/admins/render/imports/students/${req.adminData.id}`)
    }
    catch (error) {
        logError(error);
        res.status(500).render("global/error", { error: "Failed to create new Student", status: 500 })
    }

}

exports.importLecturersData = async (req, res) => {
    const { id } = req.params;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);
    const createdAt = getSystemDate();

    try {
        const lecturersArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        await Promise.all(lecturersArray.map(async (tutor) => {
            const newtutor = new LecturersDB({
                lecturerId: tutor.lecturerId,
                firstName: tutor.firstName,
                lastName: tutor.lastName,
                faculty: tutor.faculty,
                "created-at": createdAt
            });
            await newtutor.save();
        }));
        res.status(200).redirect(`/admins/render/lecturers/${id}`);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
            res.status(400).render("global/error", { error: errorMessage, status: 400 });
        } else if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(400).render("global/error", { error: `Lecturer with ID ${error.keyValue.lecturerId} already exists`, status: 400 });
        } else {
            logError(error);
            res.status(400).render("global/error", { error: "Failed to import new lecturer", status: 400 });
        }
    }
};



exports.importStudentsData = async (req, res) => {
    const { id } = req.params;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);
    const createdAt = getSystemDate();

    try {
        const studentsArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(createdAt);
        await Promise.all(studentsArray.map(async (student) => {
            const newStudent = new StudentsDB({
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                program: student.program,
                year: student.year,
                level: student.level,
                faculty: student.faculty,
                courses: student.courses,
                files: student.files,
                repos: student.repos,
                "created-at": createdAt
            });
            await newStudent.save();
        }));
        res.status(200).redirect(`/admins/render/students/${id}`);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
            res.status(400).render("global/error", { error: errorMessage, status: 400 });
        } else if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(400).render("global/error", { error: `Student with ID ${error.keyValue.studentId} already exists`, status: 400 });
        } else {
            logError(error);
            res.status(400).render("global/error", { error: "Failed to import new students", status: 400 });
        }
    }
};



exports.getUserDataByOffset = (req, res) => {
    const { userType, offset } = req.params;
    const userActionMethods = {
        students: getStudentsDataByOffset,
        lecturers: getLecturersDataByOffset
    };

    const userDataMethod = userActionMethods[userType];
    if (userDataMethod) {
        userDataMethod(offset, req.query.key ? req.query.key : 'null', req.query.value ? req.query.value : 'null')
            .then((r) => {
                res.status(r.status).json({ data: r.docs, cursor: r.cursor, end: r.end });
            }).catch((e) => {
                console.log(e);
                res.status(e.status).json({ data: e.docs, cursor: e.cursor, end: e.end });
            })
    }
    else {
        res.status(400).json({ message: 'Invalid userType' });
    }
}

exports.getStudentData = (req, res) => {
    const { action } = req.params;
    const { studentId } = req.query;

    StudentsDB.findOne({ _id: studentId })
        .then((doc) => {
            if (doc == null) {
                return res.status(404).json({ message: 'no such user found', doc: null });
            }

            const actionsMap = {
                courses: 'courses',
                repos: 'repos',
                files: 'files'
            };

            const field = actionsMap[action];

            if (field) {
                return res.status(200).json({ message: 'success', doc: doc[field] });
            }

            return res.status(403).json({ message: 'action not recognised', doc: null });
        }).catch((error) => {
            res.status(500).json({ message: 'Internal server error', error });
        })
}

exports.getLecturersData = (req, res) => {
    const { action } = req.params;
    const { id } = req.query;

    LecturersDB.findOne({ _id: id })
        .then(async (doc) => {
            if (doc == null) {
                return res.status(404).json({ message: 'no such user found', doc: null });
            }

            const actionsMap = {
                courses: 'assignedCourses',
            };

            const field = actionsMap[action];

            if (field) {
                console.log(doc[field])

                return res.status(200).json({ message: 'success', doc: await getCourses(doc[field]) });
            }

            return res.status(403).json({ message: 'action not recognised', doc: null });
        }).catch((error) => {
            res.status(500).json({ message: 'Internal server error', error });
        })
}