const forge = require('./forge.utils');
const Courses = require('../../../models/courses/courses.model');

const updateCourse = async (courseCode, v = 0,title="", tutor="", studentId ="") => {
    
    Courses.findOneAndUpdate({courseCode: courseCode})
    .then((course) => {
        if (course == null) {
            return {
                message: "No such course exists",
                doc:{},
                status: 404
            }
        }

        if (course.__v != v) {
            return {
                message: "Inconsistent data",
                doc: course,
                status: 403
            }
        } 

        course.title = title == "" ? course.title : title;
        course.lecturer = tutor == "" ? course.lecturer : tutor;
        if (studentId != "") {
            course.students.push(studentId);
        }
        course.save();

        return {
            message: "success",
            doc: course,
            status: 200
        }

    }).catch((error) => {
        forge.logError(error);
        return {
            message: "Internal Server Error",
            doc: {},
            status: 500
        };
    });
}

const deleteCourse = (courseCode, v = 0, title="", tutor="", studentId ="") => {
    Courses.deleteOne({courseCode: courseCode, __v: v})
    .then((course) => {
        if (course == null) {
            return {
                message: "Delete Action failed. Likely Inconsistent Data",
                status: 404
            }
        }

        return {
            message: "success",
            status: 200
        }
    }).catch((error) =>{
        forge.logError(error);
        return {
            message: "Internal server Error",
            status: 500
        }
    })
}


/**
 * request pack
 * /forge/courses/:action(find, update)/:id(courseId or null)/:offset(default=0)
 * 
 * headers {admin-uid, admin-id, admin-role}
 * 
 * ?key=null&value=null
 * 
 * body {title, lecturer, studentId, v}
 * 
 * updates can be performed on (course title, assigned lecturer )
 * 
 */
const courseActions = (req, res) => {
    const { action, id, offset } = req.params;
    const headerInfo = { id: req.headers['admin-uid'], adminId: req.headers['admin-id'], role: req.headers['admin-role'] }
    const { key, value } = req.query;
    const { title, lecturer, studentId, v } = req.body;
    const actionMethods = { update: updateCourse, delete: deleteCourse };

    if (action == 'render') {
        forge.findMany(key == 'null' ? null : key, value == 'null' ? null : value, offset >= 0 ? offset : 0, Courses)
            .then((docs) => {
                forge.render(res, 'courses', headerInfo, ['/css/admin/forge.courses'], {docs: docs});
            }).catch((error) => {
                logError(error);
                res.status(500).json({ message: "" })
            });
    }
    else {
        const dataMethods = actionMethods[action];
        if (dataMethods) {
            const response = dataMethods(id, v,title, lecturer, studentId);

            res.status(response.status).json(response);
        }
        else {
            forge.logError(new ReferenceError('action undefined'));
            res.status(400).json({
                message: "Bad Request",
                doc: {},
                state: false
            });
        }
    }
}

module.exports = courseActions;