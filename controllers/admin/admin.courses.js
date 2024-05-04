const Files = require('../../models/courses/files.models');

const { AdminsDB, StudentsDB, CoursesDB } = require('../../utils/global/db.utils');

const fs = require('fs');
const { getSystemDate, logError } = require('./admin.utils');

exports.manageCoursesViews = (req, res) => {
    const { id, adminId, role } = req.query;

    AdminsDB.findOne({ _id: id, adminId: adminId, role: role })
        .then((doc) => {
            if (doc !== null) {
                switch (req.params.action) {
                    case 'create':
                        res.render('admin/courses', {
                            action: 'create',
                            admin: doc
                        });
                        break;
                    case 'manage':
                        if (req.query.victim) {
                            CoursesDB.findById(req.query.victim)
                                .then(course => {
                                    res.render('admin/courses', {
                                        action: 'manage',
                                        update: true,
                                        admin: doc,
                                        course: course
                                    });
                                }).catch(error => console.log(error));
                        }
                        else {
                            res.render('admin/courses', {
                                action: 'manage',
                                update: false,
                                admin: doc,
                                course: {}
                            });
                        }
                        break;
                    default:
                        break;
                }
            }
        }).catch((error) => res.end('Manage courses encountered an error'));
}

exports.manageCourses = async (req, res) => {
    const { courseId, id } = req.params;
    const { adminData } = req;
    const course = req.body;



    if (courseId === 'new') {
        try {
            const createdAt = getSystemDate();
            const [lecturerId, name] = course.lecturer.split("_");

            const newCourse = new CoursesDB({
                courseCode: course.courseCode,
                title: course.courseTitle,
                lecturer: {
                    lecturerId: lecturerId,
                    name: name
                },
                year: course.year,
                level: Number(course.level),
                semester: Number(course.semester),
                faculty: course.faculty,
                program: course.program,
                'created-at': createdAt,
            });

            await newCourse.save();
            res.redirect(`/admins/render/courses/${id}`)

        }
        catch (err) {
            console.log(err)
        }
    }
    else {
        try {
            const [lecturerId, name] = course.lecturer.split("_");
            CoursesDB.findByIdAndUpdate({ _id: courseId })
                .then((c) => {
                    if (c.__v === Number(course.v)) {
                        c.courseCode = course.courseCode
                        c.title = course.courseTitle
                        c.lecturer.lecturerId = lecturerId;
                        c.lecturer.name = name;
                        c.year = course.year
                        c.level = Number(course.level)
                        c.semester = Number(course.semester)
                        c.faculty = course.faculty
                        c.program = course.program
                        c.__v = Number(course.v) + 1
                        c.save();
                        res.redirect(`/admins/render/courses/${id}`)

                    }
                    else {
                        res.render('global/error', { error: "Failed to update course - [ Inconsistent Data ]", status: 400 })
                    }
                })
        } catch (err) {
            logError(err);
            console.log(err)
        }
    }
}

exports.importStudentToCourse = (req, res) => {
    const { id, adminId, role } = req.query;
    const { courseCode } = req.body;
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

    const studentsArray = JSON.parse(fs.readFileSync(filePath));
    studentsArray.foreach(student => {
        StudentsDB.find({ studentId: student })
            .then((doc) => {
                if (doc !== null) {
                    CoursesDB.findOneAndUpdate({ courseCode: courseCode })
                        .then((course) => {
                            let students = [...course.students];
                            if (!students.find(doc.studentId)) {
                                students.push(doc.studentId);
                                course.students = students;
                                course.save();

                                res.status(200).json({ message: 'user added to course' });
                            }
                            else {
                                res.status(400).json({ message: 'Student already added' });
                            }
                        }).catch((error) => {
                            console.log('error while adding student to a course: ', error);
                            res.status(500).json({ message: 'Internal server error' });
                        });
                }
            }).catch((error) => {
                console.log('an error occurred while adding multiple students to a course: ', error);
                res.status(500).json({ message: 'Internal server error' });
            })
    });
}