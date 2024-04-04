const forge = require('./forge.utils');
const Lecturers = require('../../../models/lecturer/lecturer.model');

const findOne = async (id = '') => {

    try {
        const tut = await Lecturers.findOne({ _id: id });
        if (tut == null) {
            console.log("No such user");
            return "No such user: " + id;
        }

        const courses = await forge.getCourses(tut.assignedCourses);
        return {
            name: `${tut.firstName} ${tut.lastName}`,
            faculty: `${tut.faculty}`,
            courses: courses,
            state: 200
        }
    }
    catch (error) {
        forge.logError(error);

        return {
            name: null,
            faculty: null,
            courses: null,
            state: 500
        }
    }

}

const updateOne = async (query = {}, updateParams = {}) => {
    if (!forge.validateQuery(query) || !forge.validateQuery(updateParams)) {
        //TODO: Handle if invalid
        return {
            message: `Error [Invalid Query]: ${query} & ${updateParams}`,
            doc: {},
            state: false
        };
    }

    return new Promise((resolve, reject) => {
        Lecturers.findOneAndUpdate(query)
            .then((doc) => {
                if (doc == null) return false;

                if (updateParams.v != doc.__v) {
                    reject({
                        message: 'Inconsistent Data',
                        doc: doc,
                        state: false
                    });
                }
                else {
                    doc.faculty = updateParams.faculty;
                    doc.__v = doc.__v + 1;
                    doc.save();

                    resolve({
                        message: 'success',
                        doc: doc,
                        state: true
                    });
                }

            }).catch((error) => {
                console.error("Error while updating lecturer document: ");
                forge.logError(error)
                reject({
                    message: "Internal Server Error",
                    doc: {},
                    state: false
                });
            });
    })

}

const updateAssignedCourses = async (_id, action = 'add', courseCode = '', v = 0) => {
    const validCourse = await forge.isValidCourseCode(courseCode);

    return new Promise((resolve, reject) => {
        Lecturers.findOneAndUpdate({ _id: _id })
            .then((doc) => {
                if (doc == null) reject({
                    message: "Error [no match for lecturer]: " + _id,
                    doc: {},
                    state: false
                });

                if (v != doc.__v) {
                    reject({
                        message: 'Inconsistent Data',
                        doc: doc,
                        state: false
                    });
                }
                else {
                    const courses = doc.assignedCourses;
                    //TODO: check if course exists first
                    if (action == 'add') {
                        console.log(courses.indexOf(courseCode));
                        if (courses.indexOf(courseCode) == 0) {
                            reject({
                                message: "course already assiged",
                                doc: {},
                                state: false
                            })
                        }
                        else {
                            courses.push(courseCode);
                        }
                    }
                    else if (action == 'delete') {
                        courses.splice(courses.indexOf(courseCode), 1);
                    }
                    else {
                        reject({
                            message: "Invalid action call for: " + action,
                            doc: {},
                            state: false
                        });
                    }

                    doc.__v = doc.__v + 1;
                    doc.save();
                    resolve({
                        message: "success",
                        doc: doc,
                        state: true
                    });
                }

            }).catch((error) => {
                console.log("Error while updating assigned courses: ");
                forge.logError(error);
                reject({
                    message: "Error while updating assigned courses:  " + _id + " " + courseCode,
                    doc: {},
                    state: false
                })
            });
    })
}

const forgeLecturerRoutes = (req, res) => {
    /**
     * request pack
     * /forge/lecturers/:prop(users, courses, views)/:action(find, update, render)/:_id(ObjectId of lecturer, offset)
     * header {
     *      admin-uid:_id,
     *      admin-id: adminId,
     *      admin-role: role
     * }
     * 
     * ?key=queryKey&value=queryValue (defaults [key=x, value=a])
     * 
     * req.params on (prop = views & action = render) {id, adminId, role}
     * 
     * [done]req.params on (prop = users & action = find) {faculty, v}
     * [done]req.params on (prop = users & action = update) {faculty, v}
     * 
     * req.params on (prop = courses & action = find) {courseCode, v}
     * req.params on (prop = courses & action = update) {courseCode, v}
     * 
     */

    const { prop, action, _id } = req.params;
    const { key, value } = req.query;
    const headerInfo = {
        id: req.headers['admin-uid'],
        adminId: req.headers['admin-id'],
        role: req.headers['admin-role']
    }

    // if (!validateHeaderInfo(headerInfo)) {
    //     res.status(403).render('global/error', { error: 'Access denied' });
    // }

    if (prop === "users") {
        const { faculty, v } = req.body;
        if (action === "update") {
            updateOne({ _id: _id }, { faculty, v })
                .then((r) => {
                    console.log(r);
                }).catch(error => {
                    console.log("Error from updateOne: ");
                    console.log(error);
                });
        }
        else if (action === "find") {
            findOne(_id)
                .then((tutor) => {
                    res.status(tutor.state).json(tutor);
                }).catch((error) => {
                    res.status(error.state).json(error);
                });
        }
        else {
            console.log("Invalid action: ", action);
            res.status(400).json({
                message: "Bad Request"
            });
        }

    } else if (prop === "courses") {
        if (action === "update") {
            const { courseCode, v } = req.body;

            updateAssignedCourses(_id, "add", courseCode, v)
                .then((r) => {
                    res.status(200).json(r);
                }).catch((error) => {
                    console.log("Failed to update assigned courses");
                    res.status(404).json(error);
                });
        }
        else {
            res.status(400).json({
                message: "Bad Request"
            });
        }
    }
    else if (prop === 'views') {
        if (action === "render") {
            const offset = req.params._id;
            console.log(key, value, offset)
            forge.findMany(key == 'null' ? null : key, value == 'null' ? null : value, offset >= 0 ? offset : 0, Lecturers)
                .then((docs) => {
                    forge.render(res, 'lecturers', headerInfo, ['/css/admin/forge.lecturers']);
                }).catch((error) => {
                    logError(error);
                    res.status(500).json({ message: "" })
                });
        }
    }
}

module.exports = forgeLecturerRoutes;