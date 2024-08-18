import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { logError, getSystemDate } from './admin.utils.js';
import { AdminsDB, StudentsDB, CoursesDB, LecturersDB } from '../../utils/global/db.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const Admins = AdminsDB();
const Tutors = LecturersDB();
const Students = StudentsDB();
const Courses = CoursesDB();


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
            const existingUser = await Admins.findOne({ adminId: adminId });
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

export const createNewAdmin = async (req, res) => {
    const { firstname, lastname, userPassword, role, faculty } = req.body;

    try {
        const verifiedAdminId = await generateAndVerifyAdminIdHasNoMatch(faculty);

        if (verifiedAdminId === null) {
            res.status(500).json({ message: "Create New Admin Failed - Operation Timed Out" });
            return;
        }

        const admin = new Admins({ adminId: verifiedAdminId, firstName: firstname, lastName: lastname, faculty, role, password: userPassword });
        const savedAdmin = await admin.save();
        const { password, ...rest } = savedAdmin._doc;

        if (savedAdmin) {
            return res.status(200).json({ admin: rest });
        }
    } catch (error) {
        logError(error)
        return null;
    }
}

export const getStudentsDataByOffset = async (offset, key, value, limit = 256) => {
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    try {
        const data = await Students.find(query).skip(offset).limit(limit).exec();
        if (!data) return null;

        return {
            status: 200,
            message: 'success',
            docs: data,
            cursor: Number(offset) + limit,
            end: data.length < limit
        };
    } catch (error) {
        console.log(error);
        return {
            status: 500,
            message: 'An error occurred while fetching',
            docs: [],
            cursor: 0,
            end: false
        };
    }
};

export const getLecturersDataByOffset = async (offset, key, value, limit = 256) => {
    let query = key != 'null' || value != 'null' ? { [key]: value } : {};

    try {
        const data = await Tutors.find(query).skip(offset).limit(limit).exec();
        if (!data) return null;
        return {
            status: 200,
            message: 'success',
            docs: data,
            cursor: Number(offset) + limit,
            end: data.length < limit
        }

    } catch (error) {
        console.log(error)
        return {
            status: 500,
            message: 'An error occurred while fetching',
            docs: [],
            cursor: 0,
            end: false
        };
    }
}

export const createLecturer = async (req, res) => {
    try {
        const createdAt = getSystemDate();
        const { lecturerId, firstName, lastName, faculty } = req.body;

        const tutor = new Tutors({
            lecturerId: lecturerId,
            firstName: firstName,
            lastName: lastName,
            faculty: faculty,
            "created-at": createdAt
        });

        await tutor.save();

        res.status(200).redirect(`/admins/render/tutors/${req.adminData.id}`);
    } catch (error) {
        if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(400).render("global/error", { error: `Lecturer with ID ${error.keyValue.lecturerId} already exists`, status: 400 });
        } else {
            logError(error);
            res.status(500).redirect(`/admins/render/tutors/${req.adminData.id}`);
        }
    }
};

export const updateLecturer = async (req, res) => {
    if (!isRequestBodyValid(req.body))
        return res.status(400).render("global/error", {
            error: "Failed to update lecturer because of invalid request body",
            status: 400
        });

    const { id, firstName, lastName, faculty } = req.body;
    console.log({ id, firstName, lastName, faculty } )

    try {
       await Tutors.findOneAndUpdate({ _id: id }, {
            $set: {
                firstName: firstName,
                lastName: lastName,
                faculty: faculty
            }

        })

        return res.status(200).redirect(`/admins/render/tutors/${req.adminData.id}`);
    }
    catch (error) {
        logError(error);
        return res.status(500).redirect(`/admins/render/tutors/${req.adminData.id}`)
    }
}

const isRequestBodyValid = (body = {}) => {
    if (Object.keys(body).length === 0) return null;

    for (let key of Object.keys(body))
        if (key.length === 0)
            return null;

    return true;
}

export const createStudent = async (req, res) => {
    if (!isRequestBodyValid(req.body))
        return res.status(400).render("global/error", {
            error: "Failed to create new Student because of invalid request body",
            status: 400
        });

    const { studentId, firstName, lastName, program, year, level, session, faculty, registeredCourses } = req.body;

    try {
        const student = new Students({ studentId, firstName, lastName, program, level, session, faculty, registeredCourses });
        await student.save();

        return res.status(200).redirect(`/admins/render/students/${req.adminData.id}`);
    }
    catch (error) {
        logError(error);
        return res.status(500).redirect(`/admins/render/students/${req.adminData.id}`)
    }

}

export const updateStudent = async (req, res) => {
    if (!isRequestBodyValid(req.body))
        return res.status(400).render("global/error", {
            error: "Failed to create new Student because of invalid request body",
            status: 400
        });

    const { id, program, year, level, session, faculty } = req.body;

    try {
        await Students.findOneAndUpdate({ _id: id }, {
            $set: {
                program: program,
                year: year,
                level: level,
                session: session,
                faculty: faculty,
            }
        })

        return res.status(200).redirect(`/admins/render/students/${req.adminData.id}`);
    }
    catch (error) {
        logError(error);
        return res.status(500).redirect(`/admins/render/students/${req.adminData.id}`)
    }

}

export const importLecturersData = async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);

    try {
        const lecturersArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (lecturersArray.length === 0) return res.status(400).redirect(`/admins/render/tutors/${id}`);
        const lecturersToInsert = lecturersArray.map((tutor) => ({
            lecturerId: tutor.lecturerId,
            firstName: tutor.firstName,
            lastName: tutor.lastName,
            faculty: tutor.faculty,
            email: `${tutor.lecturerId}@gctu.edu.gh`
        }));

        const saveResults = await Promise.all(lecturersToInsert.map(async (tutor) => {
            try {
                const newTutor = new Tutors(tutor);
                await newTutor.save();
                return { success: true, lecturerId: tutor.lecturerId };
            } catch (error) {
                logError(error);
                return { success: false, lecturerId: tutor.lecturerId, error };
            }
        }));

        const failedSaves = saveResults.filter(result => !result.success);
        if (failedSaves.length > 0) {
            console.log('Failed to save the following tutors:', failedSaves);
            return res.status(500).redirect(`/admins/render/tutors/${id}`);
        }

        return res.status(200).redirect(`/admins/render/tutors/${id}`);
    } catch (error) {
        logError(error);
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
            console.log(errorMessage)
            res.status(400).redirect(`/admins/render/tutors/${id}`);
        } else if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(500).redirect(`/admins/render/tutors/${id}`);
        } else {
            res.status(500).redirect(`/admins/render/tutors/${id}`);
        }
        return;
    }
};



export const importStudentsData = async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/imports', filename);

    try {
        const studentsArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.from(studentsArray).length === 0) return res.status(400).redirect(`/admins/render/students/${id}`);

        const studentsToInsert = Array.from(studentsArray).map((student) => ({
            studentId: student.studentId,
            firstName: student.firstName,
            lastName: student.lastName,
            program: student.program,
            level: student.level,
            faculty: student.faculty,
            session: student.session,
            registeredCourses: student.registeredCourses,
            email: `${student.studentId}@gctu.edu.gh`
        }));

        const saveResults = await Promise.all(studentsToInsert.map(async (student) => {
            try {
                const newStudent = new Students(student);
                await newStudent.save();
                return { success: true, studentId: student.studentId };
            } catch (error) {
                logError(error);
                return { success: false, studentId: student.studentId, error };
            }
        }));

        const failedSaves = saveResults.filter(result => !result.success);
        if (failedSaves.length > 0) {
            console.log('Failed to save the following students:', failedSaves);
            return res.status(500).redirect(`/admins/render/students/${id}?error=partialFailure`);
        }

        return res.status(200).redirect(`/admins/render/students/${id}`);
    } catch (error) {
        logError(error);
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
            console.log(errorMessage)
            res.status(400).redirect(`/admins/render/students/${id}?error=validationError`);
        } else if (error.code === 11000 && error.keyValue && error.keyPattern) {
            res.status(500).redirect(`/admins/render/students/${id}?error=11000`);
        } else {
            res.status(500).redirect(`/admins/render/students/${id}?error=500`);
        }
        return;
    }
};



export const getUserDataByOffset = async (req, res) => {
    const { userType, offset } = req.params;
    const userActionMethods = {
        students: getStudentsDataByOffset,
        lecturers: getLecturersDataByOffset
    };

    try {
        const userDataMethod = userActionMethods[userType];
        if (!userDataMethod) return res.status(400).json({ message: 'Invalid userType' });

        const response = await userDataMethod(offset, req.query.key ? req.query.key : 'null', req.query.value ? req.query.value : 'null');

        if (!response) return res.status(400).json({ data: [], cursor: 0, end: true });
        if (response.status === 500) return res.status(response.status).json({ data: response.docs, cursor: response.cursor, end: response.end });

        return res.status(response.status).json({ data: response.docs, cursor: response.cursor, end: response.end });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: 'An internal Server Error occured' });
    }
}

export const getStudentData = (req, res) => {
    const { action } = req.params;
    const { studentId } = req.query;
    const actionsMap = {
        courses: 'courses',
        repos: 'repos',
        files: 'files'
    };
    return res.status(400).json({ message: 'fail', doc: [] });

}

export const getLecturersName = async (req, res) => {
    const { id } = req.params;
    try {
        const lecturer = await Tutors.findOne({ lecturerId: id });
        if (!lecturer) return res.status(400).json({ data: {} });

        res.set('Cache-Control', 'public, max-age=8600');
        return res.status(200).json({ data: { firstname: lecturer.firstName, lastname: lecturer.lastName } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ data: {} });
    }
}