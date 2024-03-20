const Admins = require('../../models/admin/admin.models');
const Courses = require('../../models/courses/courses.model');
const Students = require('../../models/student/student.model');
const Files = require('../../models/courses/files.models');

const fs = require('fs');

exports.manageCoursesViews = (req, res) => {
    const { id, adminId, role } = req.query;

    Admins.findOne({ _id: id, adminId: adminId, role: role })
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
                            Courses.findById(req.query.victim)
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

exports.manageCourses = (req, res) => {
    const { id, adminId, role, department } = req.query;

    if (req.params.action === 'create') {
        Admins.findOne({ _id: id, adminId, role, department })
            .then((doc) => {
                console.log(doc);
                if (doc.role === role && role === 'shepherd') {
                    const course = new Courses({
                        courseCode: req.body.courseCode,
                        title: req.body.title,
                        year: req.body.year,
                        level: req.body.level,
                        semester: req.body.semester,
                        department: req.body.department,
                        lecturer: req.body.lecturer,
                        students: [],
                        resources: [],
                        assignments: [],
                        recordings: [],
                        submissions: [],
                        schedule: {}
                    });
                    course.save();
                    res.redirect(`/admin/dashboards?id=${id}&&adminId=${adminId}`);
                }
                else {
                    res.render('global/error');
                }
            }).catch((error) => console.log('error on line 31 (admin.courses): ', error));
    }
    else if (req.params.action === 'update') {
        Courses.findByIdAndUpdate(req.body.id)
            .then(doc => {
                if (doc.__v == req.body.v) {
                    doc.courseCode = req.body.courseCode;
                    doc.title = req.body.title;
                    doc.year = req.body.year;
                    doc.level = req.body.level;
                    doc.semester = req.body.semester;
                    doc.department = req.body.department;
                    doc.lecturer = req.body.lecturer;
                    doc.__v = Number(req.body.v) + 1;

                    doc.save();
                    res.redirect(`/admin/dashboards?id=${id}&&adminId=${adminId}`);
                }
                else {
                    res.render('global/error');
                }
            }).catch((error) => {
                console.log(error);
            })
    }
    else if (req.params.action === 'add_student') {
        const { studentId, courseCode } = req.body;
        Students.findOne({ studentId: studentId })
            .then((doc) => {
                if (doc !== null) {
                    let courses = [...doc.courses];
                    if (courses.find(courseCode)) {
                        Courses.findOneAndUpdate({ courseCode: courseCode })
                            .then((course) => {
                                let students = [...course.students];
                                if (!students.find(studentId)) {
                                    students.push(studentId);
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
                } else {
                    res.status(400).json({ message: 'no such user' });
                }
            })
            .catch((error) => {
                console.log('Error while checking if user exists: ', error);
                res.status(500).json({ message: 'Internal server error' });
            })
    }
    else {
        res.redirect(`/admin/dashboards?id=${id}&&adminId=${adminId}`);
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
        Students.find({ studentId: student })
            .then((doc) => {
                if (doc !== null) {
                    Courses.findOneAndUpdate({ courseCode: courseCode })
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