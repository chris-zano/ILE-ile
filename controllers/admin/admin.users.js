const path = require('path');
const fs = require('fs');
//user models import
const Admins = require('../../models/admin/admin.models');
const Lecturers = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');
const Courses = require('../../models/courses/courses.model');
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

    return Students.find(query)
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

    return Lecturers.find(query)
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

//handlers
exports.createStudent = (req, res) => {
    const { id, adminId, role } = req.query;

    Admins.findOne({ _id: id, adminId: adminId, role: role })
        .then((doc) => {
            if (doc._id === id) {
                const { studentId, firstname, lastname, program, year, level } = req.body;
                const student = new Students({ studentId, firstname, lastname, program, year, level, courses: [], files: [], repos: [] });
                student.save();

                res.status(200).json({ message: 'saved successfully' });
            }
            else {
                res.status(403).json({ message: 'Bad request' });
            }
        }).catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        });
}

exports.importStudentsData = (req, res) => {
    const { id, adminId, role } = req.query;
    const { originalname, filename } = req.file;
    const filePath = path.join(__dirname, '..', '..', 'models/student/studentsDataImports', filename);


    try {
        const studentsArray = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        studentsArray.forEach((student) => {
            const newStudent = new Students({
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                program: student.program,
                year: student.year,
                level: student.level,
                department: student.department,
                faculty: student.faculty,
                courses: student.courses,
                files: student.files,
                repos: student.repos
            });
            newStudent.save();
        });

        const newFile = new Files({
            filename,
            originalname,
            fileUrl: filePath,
            owner: id,
            'created-at': new Date().getDate()
        });
        newFile.save();
        res.status(200).redirect(`/admin/dashboards?id=${id}&&adminId=${adminId}`)
    }
    catch (error) {
        console.log("failed to readfile: ", error);
    }
}

exports.manageUser = (id, adminId, role, victimId, res) => {
    if (victimId != null || victimId != undefined) {

        Admins.findById(victimId)
            .then(doc => {
                const copyDash = { ...dashboardData }
                copyDash.adminId = doc.adminId;
                copyDash._id = doc._id;
                copyDash.adminObject = doc
                copyDash.role = doc.role;
                if (doc != null) {
                    res.render('admin/manage-users', { user: doc, id, adminId, role, ...copyDash });
                }
            }).catch(error => {
                console.log('from here: ', error);
            });
    }
    else {
        res.render('global/error');
    }
}

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

    Students.findOne({ _id: studentId })
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

    Lecturers.findOne({ _id: id })
        .then((doc) => {
            if (doc == null) {
                return res.status(404).json({ message: 'no such user found', doc: null });
            }

            const actionsMap = {
                courses: 'assignedCourses',
            };

            const field = actionsMap[action];
            console.log(field)

            if (field) {
                return res.status(200).json({ message: 'success', doc: doc[field] });
            }

            return res.status(403).json({ message: 'action not recognised', doc: null });
        }).catch((error) => {
            res.status(500).json({ message: 'Internal server error', error });
        })
}