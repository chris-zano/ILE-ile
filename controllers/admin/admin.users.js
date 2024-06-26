const path = require('path');
const fs = require('fs');
//user models import

const { getCourses, logError, getSystemDate } = require("./admin.utils");
const { AdminsDB, StudentsDB, CoursesDB, LecturersDB } = require('../../utils/global/db.utils');
const Files = require('../../models/courses/files.models');
const { isValidObjectId } = require('mongoose');

const admin = AdminsDB();
const lecturer = LecturersDB();
const student = StudentsDB();
const course = CoursesDB();


/**
 * Generates a unique admin ID based on the provided faculty.
 * The ID consists of a prefix ('AD'), a three-digit random number, and a faculty abbreviation.
 * If the faculty is not recognized, it returns "Faculty Undefined".
 * 
 * @param {string} faculty - The faculty name to generate the ID for.
 * @returns {string} - The generated unique admin ID or "Faculty Undefined" if the faculty is not recognized.
 */
const generateUniqueAdminID = (faculty) => {
    const prefix = 'AD';
    const facultyUndefinedString = "Faculty Undefined";
    const facultyAbbreviations = { "Engineering": "FoE", "FoCIS": "FoCIS", "Business": "ITB" };

    // Generate a three-digit number, padded with leading zeros if necessary
    const number = String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    let matchFacultyToAbbreviation = facultyAbbreviations[faculty] || facultyUndefinedString;

    if (matchFacultyToAbbreviation === facultyUndefinedString) {
        return matchFacultyToAbbreviation;
    }

    // Combine all parts to form the ID
    return `${prefix}-${number}${matchFacultyToAbbreviation}`;
}


const generateAndVerifyAdminIdHasNoMatch = async (faculty) => {
    const Admin = AdminsDB();
    const adminRegexp = /^AD-\d{3}[A-Za-z0-9]*$/;
    let verifiedAdminId = ""
    let i = 0;
    while (i < 3) {
        const adminId = generateUniqueAdminID(faculty);
        if (adminId === "Faculty Undefined") {
            ("Faculty Undefined");
            res.status(403).json({ message: "Faculty Undefined" });
            return;
        }

        if (adminRegexp.test(adminId)) {
            const existingUser = await Admin.findOne({ adminId: adminId });
            if (!existingUser) {
                verifiedAdminId = adminId;
                break;
            }
        }
        i++;
    }

    if (verifiedAdminId === "") {
        return null;
    }

    return verifiedAdminId;
}

module.exports.createNewAdmin = async (req, res) => {
    const Admin = AdminsDB();
    const { firstname, lastname, userPassword, role, faculty } = req.body;

    const verifiedAdminId = await generateAndVerifyAdminIdHasNoMatch(faculty);

    if (verifiedAdminId === null) {
        res.status(500).json({ message: "Create New Admin Failed - Operation Timed Out" });
        return;
    }

    const admin = new Admin({ adminId: verifiedAdminId, firstName: firstname, lastName: lastname, faculty, role, password: userPassword });
    const savedAdmin = await admin.save();
    const { password, ...rest } = savedAdmin._doc;

    if (savedAdmin) {
        res.status(200).json({ admin: rest });
    }
}

module.exports.getStudentsDataByOffset = async (offset, key, value, limit = 256) => {
    let end = false;
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    return StudentsDB().find(query)
        .skip(offset)
        .limit(limit)
        .exec()
        .then((docs) => {
            if (docs.length < 256) {
                end = true;
            }
            return {
                status: 200,
                message: 'success',
                docs: docs,
                cursor: Number(offset) + limit,
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

module.exports.getLecturersDataByOffset = (offset, key, value) => {
    let end = false;
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    return LecturersDB().find(query)
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

module.exports.createLecturer = async (req, res) => {
    try {
        const Lecturer = LecturersDB()
        const createdAt = getSystemDate();
        const { lecturerId, firstName, lastName, faculty } = req.body;

        const tutor = new Lecturer({
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

const isRequestBodyValid = (body = {}) => {
    if (Object.keys(body).length === 0) return null;

    for (let key of Object.keys(body)) 
        if (key.length === 0)
            return null;
    
    return true;
}

//handlers
module.exports.createStudent = async (req, res) => {
    if (!isRequestBodyValid(req.body)) return res.status(400).render("global/error", { error: "Failed to create new Student because of invalid request body", status: 400 });

    const { studentId, firstName, lastName, program, year, level, session, faculty, registeredCourses } = req.body;
    try {
        const StudentInstance = StudentsDB();
        const student = new StudentInstance({ studentId, firstName, lastName, program, year, level, session, faculty, registeredCourses});
        await student.save();

        return res.status(200).redirect(`/admins/render/imports/students/${req.adminData.id}`)
    }
    catch (error) {
        logError(error);
        return res.status(500).render("global/error", { error: "Failed to create new Student", status: 500 })
    }

}

module.exports.importLecturersData = async (req, res) => {
    const { id } = req.params;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);
    const createdAt = getSystemDate();

    try {
        const lecturersArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let Lecturers = LecturersDB();
        await Promise.all(lecturersArray.map(async (tutor) => {
            const newtutor = new Lecturers({
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



module.exports.importStudentsData = async (req, res) => {
    const { id } = req.params;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);
    const createdAt = getSystemDate();

    try {
        const studentsArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        (createdAt);
        await Promise.all(studentsArray.map(async (student) => {
            const StudentInstance = StudentsDB();
            const newStudent = new StudentInstance({
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                program: student.program,
                year: student.year,
                level: student.level,
                faculty: student.faculty,
                session: student.session,
                registeredCourses: student.registeredCourses,
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



module.exports.getUserDataByOffset = (req, res) => {
    const { userType, offset } = req.params;
    const userActionMethods = {
        students: this.getStudentsDataByOffset,
        lecturers: this.getLecturersDataByOffset
    };

    const userDataMethod = userActionMethods[userType];
    if (userDataMethod) {
        userDataMethod(offset, req.query.key ? req.query.key : 'null', req.query.value ? req.query.value : 'null')
            .then((r) => {
                res.status(r.status).json({ data: r.docs, cursor: r.cursor, end: r.end });
            }).catch((e) => {
                (e);
                res.status(e.status).json({ data: e.docs, cursor: e.cursor, end: e.end });
            })
    }
    else {
        res.status(400).json({ message: 'Invalid userType' });
    }
}

module.exports.getStudentData = (req, res) => {
    const { action } = req.params;
    const { studentId } = req.query;

    StudentsDB().findOne({ _id: studentId })
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

module.exports.getLecturersData = (req, res) => {
    const { action } = req.params;
    const { id } = req.query;

    LecturersDB().findOne({ _id: id })
        .then(async (doc) => {
            if (doc == null) {
                return res.status(404).json({ message: 'no such user found', doc: null });
            }

            const actionsMap = {
                courses: 'assignedCourses',
            };

            const field = actionsMap[action];

            if (field) {
                return res.status(200).json({ message: 'success', doc: await getCourses(doc[field]) });
            }

            return res.status(403).json({ message: 'action not recognised', doc: null });
        }).catch((error) => {
            res.status(500).json({ message: 'Internal server error', error });
        })
}

module.exports.getLecturersName = async (req, res) => {
    const { id } = req.params;

    const Lecturer = LecturersDB();

    const lecturer = await Lecturer.findOne({ lecturerId: id });

    if (lecturer) {
        res.set('Cache-Control', 'public, max-age=8600');
        res.status(200).json({ data: { firstname: lecturer.firstName, lastname: lecturer.lastName } });
    }
    else {
        res.status(400).json({ data: {} });
    }
}