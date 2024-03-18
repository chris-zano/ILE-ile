const Admins = require('../../models/admin/admin.models');
const Courses = require('../../models/courses/courses.model');

exports.manageCourses = (req, res) => {
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
                                    action:'manage',
                                    update: true,
                                    admin: doc,
                                    course: course
                                });
                            }).catch(error => console.log(error));
                        }
                        else {
                            res.render('admin/courses', {
                                action:'manage',
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

exports.createNewCourse = (req, res) => {
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
    else if( req.params.action === 'update') {
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
        })
    }
}

exports.importStudentToCourse = (req, res) => {
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
}