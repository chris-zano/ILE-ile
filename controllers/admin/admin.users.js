const path = require('path');
const fs = require('fs');
//user models import
const Admins = require('../../models/admin/admin.models');
const Lecturers = require('../../models/lecturer/lecturer.model');
const Students = require('../../models/student/student.model');
const Courses = require('../../models/courses/courses.model');
const Files = require('../../models/courses/files.models');


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
    const filePath = path.join(__dirname, '..', '..', 'models/student', filename);


    const newFile = new Files({
        filename,
        originalname,
        fileUrl: filePath,
        owner: id,
        'created-at': new Date().getDate()
    });

    newFile.save();

    res.status(102);

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
                courses: student.courses,
                files: student.files,
                repos: student.repos
            });
            newStudent.save();
        });

        res.status(200);
        res.send('here');
    }
    catch (error) {
        console.log("failed to readfile: ", error);
    }

}